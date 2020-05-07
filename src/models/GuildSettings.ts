import { prop, getModelForClass, arrayProp } from "@typegoose/typegoose";
import { DEFAULT_SETTINGS } from "../lib/constants";

class GuildSettings {
    @prop({ unique: true })
    guildId!: string;

    @prop()
    prefix?: string;

    @arrayProp({ items: String })
    blacklist?: string[];

    @prop()
    adminRole?: string;

    @prop()
    moderatorRole?: string;

    @prop({ default: DEFAULT_SETTINGS.DEFAULT_TICKET_PREFIX })
    ticketPrefix?: string;
}

export default getModelForClass(GuildSettings);
