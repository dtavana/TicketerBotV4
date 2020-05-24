import {
    arrayProp,
    getModelForClass,
    mapProp,
    prop
} from "@typegoose/typegoose";
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

    @prop()
    LOGCHANNEL?: string;

    @prop({ default: false })
    ENFORCESUBJECT?: boolean;

    @prop({ default: 120 })
    INACTIVETIME?: number;

    @prop({ default: false })
    TRANSCRIPT?: boolean;

    @prop({ default: 0 })
    CURRENTTICKET?: number;

    @mapProp({
        of: TicketerChannel,
        default: new Map<string, TicketerChannel>()
    })
    TICKETCHANNELS?: Map<string, TicketerChannel>;

    @mapProp({ of: TicketerTicket, default: new Map<string, TicketerTicket>() })
    TICKETS?: Map<string, TicketerTicket>;
}

export default getModelForClass(TicketerGuild);
