import { Listener } from "discord-akairo";
import { MESSAGES } from "../../../lib/constants";
import { TOPICS } from "../../../utils/logger";

export default class ShardReconnectListener extends Listener {
    public constructor() {
        super("shardReconnecting", {
            emitter: "client",
            event: "shardReconnecting",
            category: "client"
        });
    }

    public exec(id: number) {
        this.client.logger.info(MESSAGES.EVENTS.SHARD_RECONNECT.LOG, {
            topic: TOPICS.DISCORD,
            event: `SHARD ${id} RECONNECTING`
        });
    }
}
