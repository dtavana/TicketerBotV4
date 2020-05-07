import { Listener } from "discord-akairo";
import { MESSAGES } from "../../../lib/constants";
import { TOPICS } from "../../../utils/logger";

export default class ShardDisconnectListener extends Listener {
    public constructor() {
        super("shardDisconnected", {
            emitter: "client",
            event: "shardDisconnect",
            category: "client"
        });
    }

    public exec(event: any, id: number) {
        this.client.logger.warn(
            MESSAGES.EVENTS.SHARD_DISCONNECT.LOG(event.code),
            {
                topic: TOPICS.DISCORD,
                event: `SHARD ${id} DISCONNECT`
            }
        );
    }
}
