import { Listener } from "discord-akairo";
import { MESSAGES } from "../../../lib/constants";
import { TOPICS, EVENTS } from "../../../utils/logger";

export default class ReadyListener extends Listener {
    public constructor() {
        super("ready", {
            emitter: "client",
            event: "ready"
        });
    }

    public async exec() {
        this.client.logger.info(MESSAGES.EVENTS.READY.LOG(this.client), {
            topic: TOPICS.DISCORD,
            event: EVENTS.READY
        });
        this.client.user?.setActivity(
            MESSAGES.EVENTS.READY.ACTIVITY(this.client.guilds.cache.size),
            { type: "WATCHING" }
        );
        this.client.settings.setClient(this.client);
        await this.client.settings.init();
        this.client.logger.info(MESSAGES.SETTINGS_MANAGER.LOADED, {
            topic: TOPICS.DISCORD_AKAIRO,
            event: EVENTS.INIT
        });
    }
}
