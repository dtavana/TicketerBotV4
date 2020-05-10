import { prop, getModelForClass, arrayProp } from "@typegoose/typegoose";
import { DEFAULT_SETTINGS } from "../lib/constants";

export class TicketerGuild {
    @prop({ unique: true })
    GUILDID!: string;

    @prop({ default: false })
    PREMIUM?: boolean;

    @prop()
    PREFIX?: string;

    @arrayProp({ items: String })
    BLACKLIST?: string[];

    @prop()
    MODERATORROLE?: string;

    @prop()
    ADMINROLE?: string;

    @prop({ default: DEFAULT_SETTINGS.DEFAULT_TICKET_PREFIX })
    TICKETPREFIX?: string;

    @prop({ unique: true })
    LOGCHANNEL?: string;

    @prop({ default: -1 })
    MAXTICKETS?: number;

    @prop({ default: false })
    ENFORCESUBJECT?: boolean;

    @prop({ default: 120 })
    INACTIVETIME?: number;

    @prop({ default: false })
    TRANSCRIPT?: boolean;
}

export default getModelForClass(TicketerGuild);
