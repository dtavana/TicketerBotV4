import { getModelForClass, prop } from "@typegoose/typegoose";
import { DEFAULT_SETTINGS } from "../lib/constants";

export class TicketerChannel {
    @prop()
    GUILDID!: string;

    @prop()
    CHANNELID!: string;

    @prop()
    CATEGORYID?: string;

    @prop({ default: false })
    MODCLOSE?: boolean;

    @prop({ default: false })
    ADMINCLOSE?: boolean;

    @prop({ default: DEFAULT_SETTINGS.WELCOME_MESSAGE })
    WELCOMEMESSAGE?: string;

    @prop({ default: 1 })
    MAXTICKETS?: number;
}

export default getModelForClass(TicketerChannel);
