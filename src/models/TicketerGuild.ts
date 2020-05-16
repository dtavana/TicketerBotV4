import {
    prop,
    getModelForClass,
    arrayProp,
    mapProp
} from "@typegoose/typegoose";
import { DEFAULT_SETTINGS } from "../lib/constants";
import { TicketerChannel } from "./TicketerChannel";
import { TicketerTicket } from "./TicketerTicket";

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

    @prop({ default: DEFAULT_SETTINGS.TICKET_PREFIX })
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

    @mapProp({ of: TicketerChannel })
    TICKETCHANNELS?: Map<string, TicketerChannel>;

    @mapProp({ of: TicketerTicket })
    TICKETS?: Map<string, TicketerTicket>;
}

export default getModelForClass(TicketerGuild);
