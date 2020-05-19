import { MessageEmbed } from "discord.js";
import { AkairoClient } from "discord-akairo";
import { User } from "discord.js";
import { TicketerChannel } from "../models/TicketerChannel";
import { TicketerTicket } from "../models/TicketerTicket";

export enum SETTINGS {
    GUILDID = "GUILDID",
    PREMIUM = "PREMIUM",
    PREFIX = "PREFIX",
    BLACKLIST = "BLACKLIST",
    ADMINROLE = "ADMINROLE",
    MODERATORROLE = "MODERATORROLE",
    TICKETPREFIX = "TICKETPREFIX",
    LOGCHANNEL = "LOGCHANNEL",
    MAXTICKETS = "MAXTICKETS",
    ENFORCESUBJECT = "ENFORCESUBJECT",
    INACTIVETIME = "INACTIVETIME",
    TRANSCRIPT = "TRANSCRIPT",
    TICKETCHANNELS = "TICKETCHANNELS",
    TICKETS = "TICKETS"
}

export interface Settings {
    GUILDID: string;
    PREMIUM: boolean;
    PREFIX: string;
    BLACKLIST: string[];
    ADMINROLE: string;
    MODERATORROLE: string;
    TICKETPREFIX: string;
    LOGCHANNEL: string;
    MAXTICKETS: number;
    ENFORCESUBJECT: boolean;
    INACTIVETIME: number;
    TRANSCRIPT: boolean;
    TICKETCHANNELS: Map<string, TicketerChannel>;
    TICKETS: Map<string, TicketerTicket>;
}

export const CLIENT_OPTIONS = {
    DEFAULT_PREFIX: "-",
    OWNERS: ["112762841173368832"],
    FOOTER_TEXT: "Ticketer v4.0 | twist#7777"
};

export const EMBEDS = {
    SUCCESS: () => {
        return new MessageEmbed()
            .setFooter(CLIENT_OPTIONS.FOOTER_TEXT)
            .setColor("GREEN")
            .setTimestamp();
    },
    FAILURE: () => {
        return new MessageEmbed()
            .setFooter(CLIENT_OPTIONS.FOOTER_TEXT)
            .setColor("RED")
            .setTimestamp();
    },
    PROMPT: (text: string): MessageEmbed => {
        return new MessageEmbed()
            .setFooter(CLIENT_OPTIONS.FOOTER_TEXT)
            .setColor("YELLOW")
            .setTimestamp()
            .setDescription(
                `${text}\n\nType \`cancel\` to cancel the command.`
            );
    }
};
export const COMMAND_NAMES = {
    MODERATION: {
        BLACKLIST: "blacklist",
        UNBLACKLIST: "unblacklist"
    },
    CONFIG: {
        SETUP: "setup",
        ADMINROLE: "adminrole",
        MODERATORROLE: "moderatorrole",
        TICKETPREFIX: "ticketprefix",
        LOGCHANNEL: "logchannel",
        MAXTICKETS: "maxtickets",
        ENFORCESUBJECT: "enforcesubject",
        INACTIVETIME: "inactivetime",
        TRANSCRIPT: "transcript",
        TICKET_CHANNEL_CONFIG: {
            WELCOMEMESSAGE: "welcomemessage",
            ADMINCLOSE: "adminclose",
            TICKETCHANNEL: "ticketchannel"
        }
    },
    INFO: {
        UPGRADE: "upgrade"
    },
    CREDITS: {
        REDEEM: "redeem",
        CREDITS: "credits"
    }
};

export const PREMIUM_COMMANDS = [
    COMMAND_NAMES.CONFIG.TICKETPREFIX,
    COMMAND_NAMES.CONFIG.MAXTICKETS,
    COMMAND_NAMES.CONFIG.ENFORCESUBJECT,
    COMMAND_NAMES.CONFIG.INACTIVETIME,
    COMMAND_NAMES.CONFIG.TRANSCRIPT,
    COMMAND_NAMES.CONFIG.TICKET_CHANNEL_CONFIG.WELCOMEMESSAGE,
    COMMAND_NAMES.CONFIG.TICKET_CHANNEL_CONFIG.ADMINCLOSE
];

export const MESSAGES = {
    COMMANDS: {
        TYPES: {
            TICKETER_CHANNEL: {
                START: (author?: User) =>
                    `${author}, what Ticketer channel do you want to modify?`,
                RETRY: (author?: User) =>
                    `${author}, please input a valid Ticketer channel.`
            }
        },
        MODERATION: {
            BLACKLIST: {
                PROMPT: {
                    START: (author?: User) =>
                        `${author}, what member do you want to blacklist?`,
                    RETRY: (author?: User) =>
                        `${author}, please mention a member.`
                },
                INVALID: (target: User) =>
                    `${target} is already blacklisted in this server`,
                NOBOT: () => "Bots can not be blacklisted",
                SUCCESS: (target: User) =>
                    `${target} has been added to the blacklist`
            },
            UNBLACKLIST: {
                PROMPT: {
                    START: (author?: User) =>
                        `${author}, what member do you want to unblacklist?`,
                    RETRY: (author?: User) =>
                        `${author}, please mention a member.`
                },
                INVALID: (target: User) =>
                    `${target} is not blacklisted in this server`,
                SUCCESS: (target: User) =>
                    `${target} has been removed from the blacklist`
            }
        },
        CONFIG: {
            NOTSET: "Not set",
            ADMINROLE: {
                PROMPT: {
                    START: (author?: User) =>
                        `${author}, what role do you want to set as the administrator role?`,
                    RETRY: (author?: User) =>
                        `${author}, please mention a role.`
                },
                SUCCESS: (old: string, target: string) =>
                    `Old Admin Role: ${old}\nNew Admin Role: ${target}`
            },
            MODERATORROLE: {
                PROMPT: {
                    START: (author?: User) =>
                        `${author}, what role do you want to set as the moderator role?`,
                    RETRY: (author?: User) =>
                        `${author}, please mention a role.`
                },
                SUCCESS: (old: string, target: string) =>
                    `Old Moderator Role: ${old}\nNew Moderator Role: ${target}`
            },
            TICKETPREFIX: {
                PROMPT: {
                    START: (author?: User) =>
                        `${author}, what would you like to set as the ticket prefix?`,
                    RETRY: (author?: User) =>
                        `${author}, please type a string less than 10 characters.`
                },
                SUCCESS: (old: string, target: string) =>
                    `Old Ticket Prefix: \`${old}\`\nNew Ticket Prefix: \`${target}\``
            },
            LOGCHANNEL: {
                PROMPT: {
                    START: (author?: User) =>
                        `${author}, what would you like to set as the log channel?`,
                    RETRY: (author?: User) =>
                        `${author}, please mention a channel.`
                },
                SUCCESS: (old: string, target: string) =>
                    `Old Log Channel: ${old}\nNew Log Channel: ${target}`
            },
            MAXTICKETS: {
                PROMPT: {
                    START: (author?: User) =>
                        `${author}, what would you like to set as the maximum number of tickets? **NOTE:** -1 will allow for unlimited tickets`,
                    RETRY: (author?: User) =>
                        `${author}, please enter a number.`
                },
                SUCCESS: (old: string, target: string) =>
                    `Old Max Tickets: \`${old}\`\nNew Max Tickets: \`${target}\``
            },
            ENFORCESUBJECT: {
                PROMPT: {
                    START: (author?: User) =>
                        `${author}, would you like to enforce a subject when creating a ticket?`,
                    RETRY: (author?: User) =>
                        `${author}, please enter true **or** false.`
                },
                SUCCESS: (old: string, target: string) =>
                    `Old Enforce Subject: \`${old}\`\nNew Enforce Subject: \`${target}\``
            },
            INACTIVETIME: {
                PROMPT: {
                    START: (author?: User) =>
                        `${author}, what would you like to set as the inactive time?`,
                    RETRY: (author?: User) =>
                        `${author}, please enter a number.`
                },
                SUCCESS: (old: string, target: string) =>
                    `Old Inactive Time: \`${old}\`\nNew Enforce Subject: \`${target}\``
            },
            TRANSCRIPT: {
                PROMPT: {
                    START: (author?: User) =>
                        `${author}, would you like to create and send transcripts after closing a ticket?`,
                    RETRY: (author?: User) =>
                        `${author}, please enter true **or** false.`
                },
                SUCCESS: (old: string, target: string) =>
                    `Old Transcript: \`${old}\`\nNew Transcript: \`${target}\``
            },
            TICKET_CHANNEL_CONFIG: {
                ADMINCLOSE: {
                    PROMPT: {
                        START: (author?: User) =>
                            `${author}, would you like to disallow all non admins from closing tickets?`,
                        RETRY: (author?: User) =>
                            `${author}, please enter true **or** false.`
                    },
                    SUCCESS: (old: boolean, target: boolean) =>
                        `Old Admin Close \`${old}\`\nNew Admin Close: \`${target}\``
                },
                WELCOMEMESSAGE: {
                    PROMPT: {
                        START: (author?: User) =>
                            `${author}, what would you like to set as the welcome message?`,
                        RETRY: (author?: User) =>
                            `${author}, please type a string less than 1500 characters.`
                    },
                    SUCCESS: (target: string) =>
                        `New Welcome Message: ${target}`
                },
                TICKETCHANNEL: {
                    PROMPT: {
                        START: (author?: User) =>
                            `${author}, what would you like to set as the name of this ticket channel?`,
                        RETRY: (author?: User) =>
                            `${author}, please type a string less than 20 characters.`
                    },
                    ERRORS: {
                        MISSING_PERMISSIONS:
                            "I am missing permissions to create channels, check that I have the **Manage Channels** permission enabled"
                    },
                    SUCCESS: (target: string) => `New Ticket Channel: ${target}`
                }
            }
        }
    },
    COMMAND_HANDLER: {
        PROMPT: {
            TIMEOUT: "Guess you took too long, the command has been cancelled.",
            ENDED: "The command has been cancelled.",
            CANCEL: "The command has been cancelled."
        },
        LOADED: "Command Handler has been loaded!"
    },
    ERRORS: {
        DEFAULT: "An unknown error has occured."
    },
    EVENTS: {
        READY: {
            LOG: (client: AkairoClient) =>
                `Now logged in as ${client.user?.tag} (${client.user?.id}). Serving ${client.users.cache.size} users.`,
            ACTIVITY: (guildCount: number) => `${guildCount} servers`
        },
        SHARD_DISCONNECT: {
            LOG: (code: any) =>
                `Hmm, I have to hide the fact I was defeated... I'll let you go this time! (${code})`
        },
        SHARD_RECONNECT: {
            LOG: "Come at me if you don't value your life!"
        },
        SHARD_RESUME: {
            LOG:
                "You made it out fine thanks to my luck! You ought to be thankful!"
        }
    },
    INHIBITOR_HANDLER: {
        LOADED: "Inhibitor Handler has been loaded!"
    },
    LISTENER_HANDLER: {
        LOADED: "Listener Handler has been loaded!"
    },
    SETTINGS_MANAGER: {
        LOADED: "Settings manager has been loaded!"
    },
    PREMIUM_BLOCKED: (prefix: string) =>
        `This command requires premium. Consider upgrading using \`${prefix}${COMMAND_NAMES.INFO.UPGRADE}\`. If you believe you already have a credit, use \`${prefix}${COMMAND_NAMES.CREDITS.REDEEM}\` to enable premium on this server. You can view all of your credits using \`${prefix}${COMMAND_NAMES.CREDITS.CREDITS}\``,
    MAXTICKETCHANNELS: (maxTickets: number, premium: boolean, prefix: string) =>
        premium
            ? `As a premium user, you can only have a maximum of ${maxTickets} ticket channels`
            : `As a non-premium user, you can only have a maximum of ${maxTickets} ticket channels. Consider upgrading to premium using \`${prefix}${COMMAND_NAMES.INFO.UPGRADE}\``
};

export const SETTINGS_PERMISSION = "MANAGE_GUILD";

export const MAX_REGULAR_TICKETCHANNELS = 1;

export const MAX_PREMIUM_TICKETCHANNELS = 5;

export const DEFAULT_SETTINGS = {
    TICKET_PREFIX: "ticket",
    WELCOME_MESSAGE:
        "Thank you for creating a ticket. Support will be with you shortly."
};

export const COMMAND_CATEGORIES = {
    MODERATION: "moderation",
    CONFIG: "config",
    TICKET_CHANNEL_CONFIG: "ticket-channel-config"
};

export const COMMAND_DESCRIPTIONS = {
    MODERATION: {
        BLACKLIST:
            "Use this command to blacklist a user from creating tickets in this server",
        UNBLACKLIST:
            "Use this command to remove a user from this servers blacklist"
    },
    CONFIG: {
        ADMINROLE: "Use this command to set the administrator role",
        MODERATORROLE: "Use this command to set the moderator role",
        TICKETPREFIX: "Use this command to set the ticket prefix",
        LOGCHANNEL:
            "Use this command to set the log channel. This is where transcripts and other information about tickets will be posted",
        MAXTICKETS:
            "Use this command to set the maximum number of tickets. **NOTE:** **-1** will allow for an unlimited number of tickets per user",
        ENFORCESUBJECT:
            "Use this command to set the whether or not a subject must be used when creating a ticket",
        INACTIVETIME:
            "Use this command to set the time after which an inactive ticket should be closed. **NOTE:** this should be entered in minutes",
        TRANSCRIPT:
            "Use this command to set whether or not transcripts should be generated a ticket is closed",
        TICKET_CHANNEL_CONFIG: {
            ADMINCLOSE:
                "Use this command to set whether or not to disallow non admins from closing tickets. **NOTE:** this will overwrite moderator close if set to **true**",
            WELCOMEMESSAGE:
                "Use this command to set the text sent at the beggining of a ticket",
            TICKETCHANNEL: "Use this command to create a new ticket channel"
        }
    }
};

export const ROLE_IDS = {};

export const CHANNEL_IDS = {};
