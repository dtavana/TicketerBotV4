import { prop, getModelForClass, arrayProp } from "@typegoose/typegoose";
import { DEFAULT_SETTINGS } from "../lib/constants";

export class GuildSettingsClass {
    @prop({ unique: true })
    GUILDID!: string;

    @prop()
    PREFIX?: string;

    @arrayProp({ items: String })
    BLACKLIST?: string[];

    @prop()
    ADMINROLE?: string;

    @prop()
    MODERATORROLE?: string;

    @prop({ default: DEFAULT_SETTINGS.DEFAULT_TICKET_PREFIX })
    TICKETPREFIX?: string;
}

export default getModelForClass(GuildSettingsClass);
