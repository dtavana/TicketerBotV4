import { Mongoose } from "mongoose";
import mongoClient from "../../utils/mongoClient";
import { Provider } from "discord-akairo";
import GuildSettings, {
    GuildSettings as GuildSettingsClass
} from "../../models/GuildSettings";
import { Guild } from "discord.js";
import { AkairoClient } from "discord-akairo";
import { TOPICS, EVENTS } from "../../utils/logger";
import {
    CLIENT_OPTIONS,
    SETTINGS,
    Settings,
    MESSAGES
} from "../../lib/constants";
import { DocumentType } from "@typegoose/typegoose";

export default class SettingsManager extends Provider {
    public ["constructor"]: typeof SettingsManager;

    public db!: Mongoose;
    private client!: AkairoClient;
    private model!: typeof GuildSettings;

    public constructor(model: typeof GuildSettings) {
        super();
        this.model = model;
        this.setDatabase().then();
    }

    private async setDatabase() {
        this.db = await mongoClient();
    }

    public setClient(client: AkairoClient) {
        this.client = client;
    }

    /**
     * Returns `defaultValue` if `guild` was invalid or if a document is not found, otherwise returns the ID of the `guild` that was passed in
     * @param {Guild | string} guild The guild to delete the key from
     * @param {string} key The key to delete
     * @param {unknown} defaultValue The default value to return if the `guild`, `key` are invalid or if the document can not be found
     * @template K A valid settings key
     */
    public get<K extends keyof Settings, T = undefined>(
        guild: Guild | string,
        key: K,
        defaultValue?: T
    ): Settings[K] | T {
        const GUILDID = this.constructor.getGuildId(guild);
        if (this.items.has(GUILDID)) {
            const value = this.items.get(GUILDID)[key];
            return value ?? defaultValue;
        }

        return defaultValue as T;
    }

    /**
     * Returns `undefined` if `guild` was invalid or if a previous document is not found, otherwise returns the old value that was overwritten
     * @param {Guild | string} guild The guild to delete the key from
     * @param {string} key The key to delete
     * @param {unknown} value The value to set `key` to
     * @template K A valid settings key
     */
    public async set<
        K extends keyof Settings,
        T = GuildSettingsClass[K] | undefined
    >(guild: Guild | string, key: K, value: GuildSettingsClass[K]): Promise<T> {
        const GUILDID = this.constructor.getGuildId(guild);
        if (GUILDID == null) {
            return (undefined as unknown) as T;
        }
        let previousValue: unknown;
        const document: GuildSettingsClass | null = await this.model.findOne({
            GUILDID
        });
        if (document != null) {
            previousValue = document[key];
            document[key] = value;
            await (document as DocumentType<GuildSettingsClass>).save();
            this.items.get(GUILDID)[key] = value;
        } else {
            const newDocument: GuildSettingsClass = await this.model.create({
                GUILDID
            });
            newDocument[key] = value;
            await (newDocument as DocumentType<GuildSettingsClass>).save();
            this.items.set(
                GUILDID,
                (newDocument as DocumentType<GuildSettingsClass>).toObject()
            );
        }
        if (key === SETTINGS.PREFIX)
            this.setGuildPrefix(GUILDID, value as string);
        return previousValue as T;
    }

    /**
     * Returns `false` if `guild` was invalid or if a document is not found, otherwise returns the value of the deleted key before deletion
     * @param {Guild | string} guild The guild to delete the key from
     * @param {string} key The key to delete
     */
    public async delete(guild: Guild | string, key: string) {
        const GUILDID = this.constructor.getGuildId(guild);
        if (GUILDID == null) {
            return false;
        }
        const document = await this.model.findOne({ GUILDID });
        if (document != null) {
            const previousValue = document[key];
            document[key] = undefined;
            await document.save();
            this.items.delete(GUILDID);
            const newGuildSettings = await GuildSettings.findOne(
                { GUILDID },
                { _id: 0, __v: 0 }
            );
            this.items.set(GUILDID, newGuildSettings);
            if (key === SETTINGS.PREFIX)
                this.setGuildPrefix(GUILDID, CLIENT_OPTIONS.DEFAULT_PREFIX);
            return previousValue;
        }
        return false;
    }

    /**
     * Returns `false` if `guild` was invalid, otherwise returns the ID of the `guild` that was passed in
     * @param {Guild | string} guild The guild to clear settings from
     */
    public async clear(guild: Guild | string) {
        const GUILDID = this.constructor.getGuildId(guild);
        if (GUILDID == null) {
            return false;
        }
        await this.model.deleteOne({ GUILDID });
        this.items.delete(GUILDID);
        this.setGuildPrefix(GUILDID, CLIENT_OPTIONS.DEFAULT_PREFIX);
        return GUILDID;
    }

    public async init() {
        const allGuildSettings = await GuildSettings.find(
            {},
            { _id: 0, __v: 0 }
        );
        allGuildSettings.forEach((guildSetting) => {
            this.items.set(guildSetting.GUILDID, guildSetting);
            this.setGuildPrefix(guildSetting.GUILDID, guildSetting.PREFIX);
        });
        this.client.logger.info(MESSAGES.SETTINGS_MANAGER.LOADED, {
            topic: TOPICS.DISCORD_AKAIRO,
            event: EVENTS.INIT
        });
    }

    private setGuildPrefix(
        guild: Guild | string | null,
        prefix: string | undefined
    ) {
        if (!guild) return;
        // TODO: this may cause bugs, maybe wait until client is ready
        const resolvedGuild = this.client.guilds.resolve(guild);
        if (resolvedGuild) {
            if (prefix) {
                resolvedGuild.prefix = prefix;
            } else if (resolvedGuild) {
                resolvedGuild.prefix = CLIENT_OPTIONS.DEFAULT_PREFIX;
            }
        }
    }

    private static getGuildId(guild: Guild | string): string {
        if (guild instanceof Guild) return guild.id;
        if (guild === "global" || guild === null) return "0";
        if (typeof guild === "string" && /^\d+$/.test(guild)) return guild;
        throw new TypeError(
            'Invalid guild specified. Must be a Guild instance, guild ID, "global", or null.'
        );
    }
}
