import { MessageEmbed } from "discord.js";
import { AkairoClient } from "discord-akairo";
import { User, Role } from "discord.js";

export const SETTINGS = {
    GUILDID: "guildId",
    PREFIX: "prefix",
    BLACKLIST: "blacklist",
    ADMINROLE: "adminRole"
};

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
        ADMINROLE: "adminrole"
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
                SUCCESS: (old: Role | string, target: Role) =>
                    `Old Admin Role: ${old}\nNew Admin Role: ${target}`
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
        ADMINROLE: "Use this command to set the administrator role"
    }
};

export const ROLE_IDS = {};

export const CHANNEL_IDS = {};

export const CLIENT_OPTIONS = {
    DEFAULT_PREFIX: "-",
    OWNERS: ["112762841173368832"]
};
