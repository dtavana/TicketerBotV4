import { Listener } from "discord-akairo";
import { MESSAGES } from "../../../lib/constants";
import { EVENTS, TOPICS } from "../../../utils/logger";
import { Guild } from "discord.js";

export default class GuildCreateListener extends Listener {
    public constructor() {
        super("guildCreate", {
            emitter: "client",
            event: "guildCreate"
        });
    }

    public async exec(guild: Guild) {
        await this.client.settings.initGuild(guild);
        this.client.logger.info(MESSAGES.EVENTS.GUILD_CREATE.LOG(guild), {
            topic: TOPICS.DISCORD,
            event: EVENTS.GUILD_CREATE
        });
    }
}
