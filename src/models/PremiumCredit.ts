import { getModelForClass, prop } from "@typegoose/typegoose";

export class PremiumCredit {
    @prop()
    OWNERID!: string;

    @prop({ unique: true })
    IDENTIFIER!: string;

    @prop({ default: "" })
    GUILDID?: string;
}

export default getModelForClass(PremiumCredit);
