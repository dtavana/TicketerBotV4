import {
    AkairoClient,
    CommandHandler,
    InhibitorHandler,
    ListenerHandler,
    Flag
} from "discord-akairo";
import { join } from "path";
import {
    CLIENT_OPTIONS,
    EMBEDS,
    MESSAGES,
    SETTINGS
} from "../../lib/constants";
import SettingsManager from "../managers/SettingsManager";
import TicketerGuild from "../../models/TicketerGuild";
import { Logger } from "winston";
import logger, { EVENTS, TOPICS } from "../../utils/logger";
import { Message } from "discord.js";
import TicketerManager from "../managers/TicketsManager";
import PremiumManager from "../managers/PremiumManager";
import PremiumCredit from "../../models/PremiumCredit";

declare module "discord-akairo" {
    interface AkairoClient {
        commandHandler: CommandHandler;
        settings: SettingsManager;
        tickets: TicketerManager;
        premium: PremiumManager;
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

    public settings = new SettingsManager(TicketerGuild);

    public tickets = new TicketerManager(this);

    public premium = new PremiumManager(PremiumCredit, this);

    public commandHandler: CommandHandler = new CommandHandler(this, {
        directory: join(__dirname, "..", "commands"),
        prefix: (message: Message): string =>
            this.settings.get(
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
        automateCategories: true,
        argumentDefaults: {
            prompt: {
                modifyStart: (_, str) => EMBEDS.PROMPT(str),
                modifyRetry: (_, str) => EMBEDS.PROMPT(str),
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

        this.commandHandler.resolver.addType(
            "ticketer-channel",
            async (message, phrase) => {
                if (!message.guild) return Flag.fail(phrase);
                if (!phrase) return Flag.fail(phrase);
                const resolvedChannel = this.util.resolveChannel(
                    phrase,
                    message.guild.channels.cache
                );
                const ticketChannel = this.settings
                    .get(message.guild!, SETTINGS.TICKETCHANNELS)
                    ?.get(resolvedChannel?.id);
                return ticketChannel || Flag.fail(phrase);
            }
        );

        this.commandHandler.resolver.addType(
            "ticketer-ticket",
            async (message, phrase) => {
                if (!message.guild) return Flag.fail(phrase);
                if (!phrase) return Flag.fail(phrase);
                const resolvedChannel = this.util.resolveChannel(
                    phrase,
                    message.guild.channels.cache
                );
                const ticket = this.settings
                    .get(message.guild!, SETTINGS.TICKETS)
                    ?.get(resolvedChannel?.id);
                return ticket || Flag.fail(phrase);
            }
        );
    }

    public async start() {
        await this._init();
        return this.login(process.env.BOT_TOKEN);
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
    }
}
