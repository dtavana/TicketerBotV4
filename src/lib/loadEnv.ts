import {readFileSync} from 'fs';
import {safeLoad} from 'js-yaml';
import {IClientConfig} from './bot/structures/client/IClientConfig';

export default () => {
    const botConfig: IClientConfig = safeLoad(readFileSync('bot.yml', 'utf8'));

    saveToEnv(botConfig);
};

const saveToEnv = (object: IClientConfig | IServerConfig) => {
    for (const [key, value] of Object.entries(object)) {
        process.env[key] = value;
    }
};
