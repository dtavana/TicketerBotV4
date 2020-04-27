import { prop, getModelForClass } from "@typegoose/typegoose";

class GuildSettings {
    @prop({ unique: true })
    guildId!: string;

    @prop()
    test?: string;
}

export default getModelForClass(GuildSettings);
