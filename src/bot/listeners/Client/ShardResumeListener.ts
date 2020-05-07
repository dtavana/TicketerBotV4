import { Listener } from "discord-akairo";
import { MESSAGES } from "../../../lib/constants";
import { TOPICS } from "../../../utils/logger";

export default class ShardResumeListener extends Listener {
    public constructor() {
        super("shardResume", {
            emitter: "client",
            event: "shardResume",
            category: "client"
        });
    }

    public exec(id: number) {
        this.client.logger.info(MESSAGES.EVENTS.SHARD_RESUME.LOG, {
            topic: TOPICS.DISCORD,
            event: `SHARD ${id} RESUME`
        });
    }
}
