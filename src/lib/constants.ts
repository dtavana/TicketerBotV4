import { MessageEmbed } from "discord.js";
import { AkairoClient } from "discord-akairo";
import { User, Role } from "discord.js";

export enum SETTINGS {
    GUILDID = "GUILDID",
    PREFIX = "PREFIX",
    BLACKLIST = "BLACKLIST",
    ADMINROLE = "ADMINROLE",
    MODERATORROLE = "MODERATORROLE",
    TICKETPREFIX = "TICKETPREFIX"
}

export interface Settings {
    GUILDID: string;
    PREFIX: string;
    BLACKLIST: string[];
    ADMINROLE: string;
    MODERATORROLE: string;
    TICKETPREFIX: string;
}

export const EMBEDS = {
    SUCCESS: () => {
        return new MessageEmbed()
            .setFooter(process.env.FOOTER_TEXT)
            .setColor("GREEN")
            .setTimestamp();
    },
    FAILURE: () => {
        return new MessageEmbed()
            .setFooter(process.env.FOOTER_TEXT)
            .setColor("RED")
            .setTimestamp();
    },
    PROMPT: (text: string): MessageEmbed => {
        return new MessageEmbed()
            .setFooter(process.env.FOOTER_TEXT)
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
        TICKETPREFIX: "ticketprefix"
    }
};

export const MESSAGES = {
    COMMANDS: {
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
    }
};

export const SETTINGS_PERMISSION = "MANAGE_GUILD";

export const DEFAULT_SETTINGS = {
    DEFAULT_TICKET_PREFIX: "ticket"
};

export const COMMAND_CATEGORIES = {
    MODERATION: "moderation",
    CONFIG: "config"
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
        TICKETPREFIX: "Use this command to set the ticket prefix"
    }
};

export const ROLE_IDS = {};

export const CHANNEL_IDS = {};

export const CLIENT_OPTIONS = {
    DEFAULT_PREFIX: "-",
    OWNERS: ["112762841173368832"]
};
