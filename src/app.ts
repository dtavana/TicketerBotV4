import loadEnv from "./lib/loadEnv";
import TicketerBot from "./bot/client/TicketerBot";
import { TOPICS, EVENTS } from "./utils/logger";

loadEnv("environment.yml");

const client = new TicketerBot();

client
    .on("error", (err) =>
        client.logger.error(err.message, {
            topic: TOPICS.DISCORD,
            event: EVENTS.ERROR
        })
    )
    .on("shardError", (err, id) =>
        client.logger.error(err.message, {
            topic: TOPICS.DISCORD,
            event: `SHARD ${id} ERROR`
        })
    )
    .on("warn", (info) =>
        client.logger.warn(info, { topic: TOPICS.DISCORD, event: EVENTS.WARN })
    );

client.start().then();
