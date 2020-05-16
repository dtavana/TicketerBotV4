import { prop, getModelForClass, mapProp } from "@typegoose/typegoose";
import { TicketerTicket } from "./TicketerTicket";
import { DEFAULT_SETTINGS } from "../lib/constants";

export class TicketerChannel {
    @prop({ unique: true })
    CHANNELID!: string;

    @prop({ unique: true })
    CATEGORYID!: string;

    @prop({ default: false })
    MODCLOSE?: boolean;

    @prop({ default: false })
    ADMINCLOSE?: boolean;

    @prop({ default: DEFAULT_SETTINGS.WELCOME_MESSAGE })
    WELCOMEMESSAGE?: string;

    @mapProp({ of: TicketerTicket })
    TICKETS?: Map<string, TicketerTicket>;
}

export default getModelForClass(TicketerChannel);
