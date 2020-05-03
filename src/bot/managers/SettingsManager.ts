import { Mongoose, Model, Document } from "mongoose";
import mongoClient from "./mongoClient";
import { Provider } from "discord-akairo";
import GuildSettings from "../../models/GuildSettings";
import { Guild } from "discord.js";

export default class SettingsManager extends Provider {
    public db!: Mongoose;
    private model!: Model<Document>;

    public ["constructor"]: typeof SettingsManager;

    public constructor(model: Model<Document>) {
        super();
        this.model = model;
        this.setDatabase().then();
    }

    private async setDatabase() {
        this.db = await mongoClient();
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
        return guildId;
    }

    /**
     * Returns `false` if `guild` was invalid or if a document is not found, otherwise returns the value of the deleted key before deletion
     * @param {Guild | string} guild The guild to delete the key from
     * @param {string} key The key to delete
     */
    public async delete(guild: Guild | string | null, key: string) {
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
    public get(
        guild: Guild | string | null,
        key: string,
        defaultValue?: unknown
    ) {
        const guildId = this.constructor.getGuildId(guild);
        if (guildId == null) {
            return defaultValue;
        }
        const guildSettings = this.items.get(guildId);
        if (guildSettings === undefined) return defaultValue;
        else if (!(key in guildSettings)) return defaultValue;

        return guildSettings[key];
    }

    /**
     * Returns `false` if `guild` was invalid or if a document is not found, otherwise returns the old value that was overwritten
     * @param {Guild | string} guild The guild to delete the key from
     * @param {string} key The key to delete
     * @param {unknown} value The value to set `key` to
     */
    public async set(
        guild: Guild | string | null,
        key: string,
        value: unknown
    ) {
        const guildId = this.constructor.getGuildId(guild);
        if (guildId == null) {
            return false;
        }
        const document = await this.model.findOne({ guildId });
        if (document != null) {
            const previousValue = document[key];
            document[key] = value;
            await document.save();
            this.items.get(guildId)[key] = value;
            return previousValue;
        }
        return false;
    }

    public async init() {
        const allGuildSettings = await GuildSettings.find(
            {},
            { _id: 0, __v: 0 }
        );

        allGuildSettings.forEach((guildSetting) => {
            this.items.set(guildSetting.guildId, guildSetting);
        });
    }

    private static getGuildId(guild: Guild | string | null) {
        if (guild === null) return null;
        if (guild instanceof Guild) return guild.id;
        if (guild === "global" || guild === null) return "0";
        if (typeof guild === "string" && /^\d+$/.test(guild)) return guild;
        throw new TypeError(
            'Invalid guild specified. Must be a Guild instance, guild ID, "global", or null.'
        );
    }
}
