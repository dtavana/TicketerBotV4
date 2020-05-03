// eslint-disable-next-line @typescript-eslint/no-unused-vars
import TicketerBotConfig from "./bot/client/TicketerBotConfig";

declare global {
    namespace NodeJS {
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface ProcessEnv extends TicketerBotConfig {}
    }
}

declare module "discord.js" {
    interface Guild {
        prefix?: string;
    }
}

export {};
