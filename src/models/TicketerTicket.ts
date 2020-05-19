import { prop, getModelForClass } from "@typegoose/typegoose";

export class TicketerTicket {
    @prop()
    GUILDID!: string;

    @prop()
    CHANNELID!: string;

    @prop()
    AUTHORID!: string;

    @prop()
    SUBJECT!: string;

    @prop()
    PARENTID?: string;
}

export default getModelForClass(TicketerTicket);
