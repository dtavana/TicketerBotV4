import { Mongoose } from "mongoose";
import mongoClient from "../../utils/mongoClient";
import { Provider } from "discord-akairo";
import TicketerGuild, {
    TicketerGuild as TicketerGuildClass
} from "../../models/TicketerGuild";
import { Guild } from "discord.js";
import { AkairoClient } from "discord-akairo";
import { TOPICS, EVENTS } from "../../utils/logger";
import {
    CLIENT_OPTIONS,
    SETTINGS,
    Settings,
    MESSAGES,
    ChannelMapSettings,
    TicketMapSettings
} from "../../lib/constants";
import { DocumentType } from "@typegoose/typegoose";
import { TicketerChannel } from "../../models/TicketerChannel";
import { TicketerTicket } from "../../models/TicketerTicket";
import { Role } from "discord.js";

export default class SettingsManager extends Provider {
    public ["constructor"]: typeof SettingsManager;

    public db!: Mongoose;
    private client!: AkairoClient;
    private model!: typeof TicketerGuild;

    public constructor(model: typeof TicketerGuild) {
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
     * @param {string} key The key to update
     * @param {unknown} value The value to set `key` to
     * @template K A valid settings key
     */
    public async set<
        K extends keyof Settings,
        T = TicketerGuildClass[K] | undefined
    >(guild: Guild | string, key: K, value: TicketerGuildClass[K]): Promise<T> {
        const GUILDID = this.constructor.getGuildId(guild);
        if (GUILDID == null) {
            return (undefined as unknown) as T;
        }
        let previousValue: unknown;
        let updatedSettings: DocumentType<TicketerGuildClass> | null;
        if (this.items.has(GUILDID)) {
            previousValue = this.items.get(GUILDID)[key];
            updatedSettings = await this.model.findOneAndUpdate(
                { GUILDID },
                { [key]: value },
                { new: true }
            );
            updatedSettings = updatedSettings!.toObject();
        } else {
            updatedSettings = await this.model.create({
                GUILDID,
                [key]: value
            });
            updatedSettings = updatedSettings.toObject();
            this.setGuildPrefix(GUILDID, CLIENT_OPTIONS.DEFAULT_PREFIX);
        }
        this.items.set(GUILDID, updatedSettings);
        if (key === SETTINGS.PREFIX)
            this.setGuildPrefix(GUILDID, value as string);
        return previousValue as T;
    }

    /**
     * Returns `undefined` if `guild` was invalid or if a previous document is not found, otherwise returns the old value that was overwritten
     * @param {Guild | string} guild The guild to delete the key from
     * @param {TicketerChannel} object The `TicketerChannel` to update
     * @param {string} key The key to update
     * @param {TicketerChannel[K]} value The value to set `key` to
     * @template K A valid settings key
     */
    public async setChannelProp<
        K extends keyof ChannelMapSettings,
        T = TicketerChannel[K] | undefined
    >(
        guild: Guild | string,
        object: TicketerChannel,
        key: K,
        value: TicketerChannel[K]
    ): Promise<T> {
        const GUILDID = this.constructor.getGuildId(guild);
        if (GUILDID == null) {
            return (undefined as unknown) as T;
        }
        const previousValue: unknown = object[key];
        object[key] = value;
        const map: Map<string, TicketerChannel> = this.items.get(GUILDID)[
            SETTINGS.TICKETCHANNELS
        ];
        map.set(object.CHANNELID, object);
        await this.set(guild, SETTINGS.TICKETCHANNELS, map);
        return previousValue as T;
    }

    /**
     * Returns `undefined` if `guild` was invalid or if a previous document is not found, otherwise returns the old value that was overwritten
     * @param {Guild | string} guild The guild to delete the key from
     * @param {TicketerTicket} object The `TicketerTicket` to update
     * @param {string} key The key to update
     * @param {TicketerTicket[K]} value The value to set `key` to
     * @template K A valid settings key
     */
    public async setTicketProp<
        K extends keyof TicketMapSettings,
        T = TicketerTicket[K] | undefined
    >(
        guild: Guild | string,
        object: TicketerTicket,
        key: K,
        value: TicketerTicket[K]
    ): Promise<T> {
        const GUILDID = this.constructor.getGuildId(guild);
        if (GUILDID == null) {
            return (undefined as unknown) as T;
        }
        const previousValue: unknown = object[key];
        object[key] = value;
        const map: Map<string, TicketerTicket> = this.items.get(GUILDID)[
            SETTINGS.TICKETS
        ];
        map.set(object.CHANNELID, object);
        await this.set(guild, SETTINGS.TICKETS, map);
        return previousValue as T;
    }

    /**
     * Returns `undefined` if a role can not be resolved. Otherwise, return a `Role` object.
     * @param guild The guild to operate on
     */
    public resolveAdminRole(guild: Guild): Role | undefined {
        const roleId = this.get(guild, SETTINGS.ADMINROLE);
        const resolvedRole = guild.roles.cache.get(roleId ?? "");
        return resolvedRole;
    }

    /**
     * Returns `undefined` if a role can not be resolved. Otherwise, return a `Role` object.
     * @param guild The guild to operate on
     */
    public resolveModeratorRole(guild: Guild): Role | undefined {
        const roleId = this.get(guild, SETTINGS.MODERATORROLE);
        const resolvedRole = guild.roles.cache.get(roleId ?? "");
        return resolvedRole;
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
            const newGuildSettings = await TicketerGuild.findOne(
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
        const allGuildSettings = await TicketerGuild.find(
            {},
            { _id: 0, __v: 0 }
        );
        allGuildSettings.forEach((guildSetting) => {
            this.items.set(guildSetting.GUILDID, guildSetting);
            this.setGuildPrefix(guildSetting.GUILDID, guildSetting.PREFIX);
        });
        this.client.guilds.cache.forEach(async (_, k) => {
            if (!this.items.has(k)) {
                const newSettings = await this.model.create({ GUILDID: k });
                this.items.set(k, newSettings.toObject());
                this.setGuildPrefix(k, CLIENT_OPTIONS.DEFAULT_PREFIX);
            }
        });
        this.client.logger.info(MESSAGES.SETTINGS_MANAGER.LOADED, {
            topic: TOPICS.DISCORD_AKAIRO,
            event: EVENTS.INIT
        });
    }

    public async initGuild(guild: Guild) {
        const GUILDID = this.constructor.getGuildId(guild);
        if (GUILDID == null) {
            return;
        }
        if (!this.items.has(GUILDID)) {
            const newSettings = await this.model.create({ GUILDID });
            this.items.set(GUILDID, newSettings.toObject());
            this.setGuildPrefix(guild, CLIENT_OPTIONS.DEFAULT_PREFIX);
        }
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

    public static getGuildId(guild: Guild | string): string {
        if (guild instanceof Guild) return guild.id;
        if (guild === "global" || guild === null) return "0";
        if (typeof guild === "string" && /^\d+$/.test(guild)) return guild;
        throw new TypeError(
            'Invalid guild specified. Must be a Guild instance, guild ID, "global", or null.'
        );
    }
}
