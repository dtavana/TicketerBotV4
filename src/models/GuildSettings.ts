import { prop, getModelForClass, arrayProp } from "@typegoose/typegoose";

class GuildSettings {
    @prop({ unique: true })
    guildId!: string;

    @prop()
    prefix?: string;

    @arrayProp({ items: String })
    blacklist?: string[];

    @prop()
    adminRole?: string;
}

export default getModelForClass(GuildSettings);
