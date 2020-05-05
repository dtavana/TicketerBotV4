import { Mongoose } from "mongoose";
import mongoClient from "../../utils/mongoClient";
import { Provider } from "discord-akairo";
import GuildSettings from "../../models/GuildSettings";
import { Guild } from "discord.js";
import { AkairoClient } from "discord-akairo";
import { CLIENT_OPTIONS, SETTINGS, Settings } from "../../lib/constants";

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
     * Returns `false` if `guild` was invalid, otherwise returns the ID of the `guild` that was passed in
     * @param {Guild | string} guild The guild to clear settings from
     */
    public async clear(guild: Guild | string) {
        const guildId = this.constructor.getGuildId(guild);
        if (guildId == null) {
            return false;
        }
        await this.model.deleteOne({ guildId });
        this.items.delete(guildId);
        this.setGuildPrefix(guildId, CLIENT_OPTIONS.DEFAULT_PREFIX);
        return guildId;
    }

    /**
     * Returns `false` if `guild` was invalid or if a document is not found, otherwise returns the value of the deleted key before deletion
     * @param {Guild | string} guild The guild to delete the key from
     * @param {string} key The key to delete
     */
    public async delete(guild: Guild | string, key: string) {
        const guildId = this.constructor.getGuildId(guild);
        if (guildId == null) {
            return false;
        }
        const document = await this.model.findOne({ guildId });
        if (document != null) {
            const previousValue = document[key];
            document[key] = undefined;
            await document.save();
            this.items.delete(guildId);
            const newGuildSettings = await GuildSettings.findOne(
                { guildId },
                { _id: 0, __v: 0 }
            );
            this.items.set(guildId, newGuildSettings);
            if (key === SETTINGS.PREFIX)
                this.setGuildPrefix(guildId, CLIENT_OPTIONS.DEFAULT_PREFIX);
            return previousValue;
        }
        return false;
    }

    /**
     * Returns `defaultValue` if `guild` was invalid or if a document is not found, otherwise returns the ID of the `guild` that was passed in
     * @param {Guild | string} guild The guild to delete the key from
     * @param {string} key The key to delete
     * @param {unknown} defaultValue The default value to return if the `guild`, `key` are invalid or if the document can not be found
     */
    public get<K extends keyof Settings, T = undefined>(
        guild: Guild | string,
        key: K,
        defaultValue?: T
    ): Settings[K] | T {
        const guildId = this.constructor.getGuildId(guild);
        if (this.items.has(guildId)) {
            const value = this.items.get(guildId)[key];
            return value ?? defaultValue;
        }

        return defaultValue as T;
    }

    /**
     * Returns `undefined` if `guild` was invalid or if a previous document is not found, otherwise returns the old value that was overwritten
     * @param {Guild | string} guild The guild to delete the key from
     * @param {string} key The key to delete
     * @param {unknown} value The value to set `key` to
     */
    public async set(guild: Guild | string, key: string, value: unknown) {
        const guildId = this.constructor.getGuildId(guild);
        if (guildId == null) {
            return undefined;
        }
        let previousValue = undefined;
        const document = await this.model.findOne({ guildId });
        if (document != null) {
            previousValue = document[key];
            document[key] = value;
            await document.save();
            this.items.get(guildId)[key] = value;
        } else {
            await this.model.create({ guildId, key: value });
            this.items.set(guildId, { key: value });
        }
        if (key === SETTINGS.PREFIX)
            this.setGuildPrefix(guildId, value as string);
        return previousValue;
    }

    public async init() {
        const allGuildSettings = await GuildSettings.find(
            {},
            { _id: 0, __v: 0 }
        );

        allGuildSettings.forEach((guildSetting) => {
            this.items.set(guildSetting.guildId, guildSetting);
            this.setGuildPrefix(guildSetting.guildId, guildSetting.prefix);
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
