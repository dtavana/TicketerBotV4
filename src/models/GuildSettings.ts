import { prop, getModelForClass } from "@typegoose/typegoose";

class GuildSettings {
    @prop({ unique: true })
    guildId!: string;

    @prop()
    prefix?: string;
}

export default getModelForClass(GuildSettings);
