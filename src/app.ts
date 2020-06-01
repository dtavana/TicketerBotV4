import loadEnv from "./lib/loadEnv";
import TicketerBot from "./bot/client/TicketerBot";
import { EVENTS, TOPICS } from "./utils/logger";
import { MESSAGES } from "./lib/constants";

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

process
    .on("unhandledRejection", (err: any) =>
        client.logger.error(err, { topic: TOPICS.UNHANDLED_REJECTION })
    )
    .on("SIGINT", () => {
        client.logger.info(MESSAGES.PROCESS.DESTROY_CLIENT, {
            topic: TOPICS.PROCESS,
            event: EVENTS.DESTROY
        });
        client.destroy();
        process.exit();
    })
    .on("SIGTERM", () => {
        client.logger.info(MESSAGES.PROCESS.DESTROY_CLIENT, {
            topic: TOPICS.PROCESS,
            event: EVENTS.DESTROY
        });
        client.destroy();
        process.exit();
    });

client.start().then();
