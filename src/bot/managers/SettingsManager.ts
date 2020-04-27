import { Mongoose, Model, Document } from "mongoose";
import mongoClient from "./mongoClient";
import { Provider } from "discord-akairo";
import TicketerBotClient from "../client/TicketerBot";
import { GuildResolvable } from "discord.js";
import GuildSettings from "../../models/GuildSettings";

export default class SettingsManager extends Provider {
    public db!: Mongoose;
    private client!: TicketerBotClient;
    private model!: Model<Document>;

    public constructor(model: Model<Document>) {
        super();
        this.model = model;
        this.setDatabase();
    }

    private async setDatabase() {
        this.db = await mongoClient();
    }

    public setClient(client: TicketerBotClient) {
        this.client = client;
    }

    private resolveGuild(guild: GuildResolvable): string | null {
        return this.client.guilds.resolveID(guild);
    }

    /**
     * Returns `false` if `guild` was invalid, otherwise returns the ID of the `guild` that was passed in
     * @param {GuildResolvable} guild The guild to clear settings from
     */
    public async clear(guild: GuildResolvable) {
        const guildId = this.resolveGuild(guild);
        if (guildId == null) {
            return false;
        }
        await this.model.deleteOne({ guildId });
        this.items.delete(guildId);
        return guildId;
    }

    /**
     * Returns `false` if `guild` was invalid or if a document is not found, otherwise returns the value of the deleted key before deletion
     * @param {GuildResolvable} guild The guild to delete the key from
     * @param {string} key The key to delete
     */
    public async delete(guild: GuildResolvable, key: string) {
        const guildId = this.resolveGuild(guild);
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
     * @param {GuildResolvable} guild The guild to delete the key from
     * @param {string} key The key to delete
     * @param {unknown} defaultValue The default value to return if the `guild`, `key` are invalid or if the document can not be found
     */
    public async get(
        guild: GuildResolvable,
        key: string,
        defaultValue: unknown
    ) {
        const guildId = this.resolveGuild(guild);
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
     * @param {GuildResolvable} guild The guild to delete the key from
     * @param {string} key The key to delete
     * @param {unknown} value The value to set `key` to
     */
    public async set(guild: GuildResolvable, key: string, value: unknown) {
        const guildId = this.resolveGuild(guild);
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
}
