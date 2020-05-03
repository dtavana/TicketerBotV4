import { Listener } from "discord-akairo";
import { EVENTS, TOPICS } from "../../../utils/logger";

export default class CommandErrorListener extends Listener {
    public constructor() {
        super("error", {
            emitter: "commandHandler",
            event: "error",
            category: "commandHandler"
        });
    }

    public exec(error: Error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        this.client.logger.error(error, {
            topic: TOPICS.DISCORD_AKAIRO,
            event: EVENTS.COMMAND_ERROR
        });
    }
}
