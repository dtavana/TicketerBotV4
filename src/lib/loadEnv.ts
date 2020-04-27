import { readFileSync } from "fs";
import { safeLoad } from "js-yaml";
import TicketerBotConfig from "../bot/client/TicketerBotConfig";

const saveToEnv = (object: TicketerBotConfig) => {
    // eslint-disable-next-line no-loops/no-loops
    for (const [key, value] of Object.entries(object)) {
        process.env[key] = value;
    }
};

export default (configFileName: string) => {
    const botConfig: TicketerBotConfig = safeLoad(
        readFileSync(configFileName, "utf8")
    );

    saveToEnv(botConfig);
};
