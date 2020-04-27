import {
    AkairoClient,
    CommandHandler,
    InhibitorHandler,
    ListenerHandler
} from "discord-akairo";
import { join } from "path";
import { MESSAGES, CLIENT_OPTIONS } from "../../lib/constants";
import { Intents } from "discord.js";
import SettingsManager from "../managers/SettingsManager";
import GuildSettings from "../../models/GuildSettings";

declare module "discord-akairo" {
    interface AkairoClient {
        commandHandler: CommandHandler;
        settings: SettingsManager;
    }
}

export default class TicketerBotClient extends AkairoClient {
    public commandHandler: CommandHandler = new CommandHandler(this, {
        directory: join(__dirname, "..", "commands"),
        prefix: CLIENT_OPTIONS.DEFAULT_PREFIX, // Change to PrefixSupplier
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

    public inhibitorHandler = new InhibitorHandler(this, {
        directory: join(__dirname, "..", "inhibitors")
    });

    public listenerHandler = new ListenerHandler(this, {
        directory: join(__dirname, "..", "listeners")
    });

    public constructor() {
        // Initialize Client
        super(
            { ownerID: CLIENT_OPTIONS.OWNERS },
            {
                messageCacheMaxSize: 1000,
                ws: {
                    intents: new Intents(Intents.ALL).remove(
                        "GUILD_MESSAGE_TYPING",
                        "DIRECT_MESSAGE_TYPING"
                    )
                }
            }
        );
        this.settings = new SettingsManager(GuildSettings);
    }

    /*
    public sendLog = (payload: string) => {
        for (const logger of this.loggers) {
            logger.sendLog(payload);
        }
    };

     */

    public async start() {
        await this._init();
        this.login(process.env.BOT_TOKEN);
        this.settings.setClient(this);
        await this.settings.init();
        console.log(MESSAGES.EVENTS.READY(this));
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
        //this.sendLog(MESSAGES.COMMAND_HANDLER.LOADED);
        this.inhibitorHandler.loadAll();
        //this.sendLog(MESSAGES.INHIBITOR_HANDLER.LOADED);
        this.listenerHandler.loadAll();
        //this.sendLog(MESSAGES.LISTENER_HANDLER.LOADED);
    }
}
