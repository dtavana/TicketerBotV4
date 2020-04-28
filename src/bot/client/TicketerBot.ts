import {
    AkairoClient,
    CommandHandler,
    InhibitorHandler,
    ListenerHandler
} from "discord-akairo";
import { join } from "path";
import { MESSAGES, CLIENT_OPTIONS, SETTINGS } from "../../lib/constants";
import SettingsManager from "../managers/SettingsManager";
import GuildSettings from "../../models/GuildSettings";
import { Logger } from "winston";
import logger, { TOPICS, EVENTS } from "../../utils/logger";
import { Message } from "discord.js";

declare module "discord-akairo" {
    interface AkairoClient {
        commandHandler: CommandHandler;
        settings: SettingsManager;
        logger: Logger;
    }
}

export default class TicketerBotClient extends AkairoClient {
    public inhibitorHandler = new InhibitorHandler(this, {
        directory: join(__dirname, "..", "inhibitors")
    });

    public listenerHandler = new ListenerHandler(this, {
        directory: join(__dirname, "..", "listeners")
    });

    public logger = logger;

    public settings = new SettingsManager(GuildSettings);

    public commandHandler: CommandHandler = new CommandHandler(this, {
        directory: join(__dirname, "..", "commands"),
        prefix: async (message: Message): Promise<string> =>
            await this.settings.get(
                message.guild!,
                SETTINGS.PREFIX,
                CLIENT_OPTIONS.DEFAULT_PREFIX
            ),
        aliasReplacement: /-/g,
        handleEdits: true,
        commandUtil: true,
        defaultCooldown: 3000,
        ignoreCooldown: CLIENT_OPTIONS.OWNERS,
        ignorePermissions: CLIENT_OPTIONS.OWNERS,
        argumentDefaults: {
            prompt: {
                modifyStart: (_, str) =>
                    MESSAGES.COMMAND_HANDLER.PROMPT.MODIFY_START(str),
                modifyRetry: (_, str) =>
                    MESSAGES.COMMAND_HANDLER.PROMPT.MODIFY_RETRY(str),
                timeout: MESSAGES.COMMAND_HANDLER.PROMPT.TIMEOUT,
                ended: MESSAGES.COMMAND_HANDLER.PROMPT.ENDED,
                cancel: MESSAGES.COMMAND_HANDLER.PROMPT.CANCEL
            },
            otherwise: ""
        }
    });

    public constructor() {
        // Initialize Client
        super(
            { ownerID: CLIENT_OPTIONS.OWNERS },
            {
                messageCacheMaxSize: 1000
            }
        );
    }

    public async start() {
        await this._init();
        await this.login(process.env.BOT_TOKEN);
        this.settings.setClient(this);
    }

    private async _init() {
        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            inhibitorHandler: this.inhibitorHandler,
            listenerHandler: this.listenerHandler
        });
        this.commandHandler.loadAll();
        this.logger.info(MESSAGES.COMMAND_HANDLER.LOADED, {
            topic: TOPICS.DISCORD_AKAIRO,
            event: EVENTS.INIT
        });
        this.inhibitorHandler.loadAll();
        this.logger.info(MESSAGES.INHIBITOR_HANDLER.LOADED, {
            topic: TOPICS.DISCORD_AKAIRO,
            event: EVENTS.INIT
        });
        this.listenerHandler.loadAll();
        this.logger.info(MESSAGES.LISTENER_HANDLER.LOADED, {
            topic: TOPICS.DISCORD_AKAIRO,
            event: EVENTS.INIT
        });
        await this.settings.init();
        this.logger.info(MESSAGES.SETTINGS_MANAGER.LOADED, {
            topic: TOPICS.DISCORD_AKAIRO,
            event: EVENTS.INIT
        });
    }
}
