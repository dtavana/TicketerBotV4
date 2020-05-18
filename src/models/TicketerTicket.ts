import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { TicketerChannel } from "./TicketerChannel";

export class TicketerTicket {
    @prop()
    GUILDID!: string;

    @prop()
    CHANNELID!: string;

    @prop()
    AUTHORID!: string;

    @prop()
    SUBJECT!: string;

    @prop({ ref: "TicketerChannel" })
    PARENT?: Ref<TicketerChannel>;
}

export default getModelForClass(TicketerTicket);
