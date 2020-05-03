import { MessageEmbed } from "discord.js";
import { AkairoClient } from "discord-akairo";
import { User } from "discord.js";
import { Role } from "discord.js";

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
                INVALID: (target: User) =>
                    `${target.toString()} is already blacklisted in this server`,
                SUCCESS: (target: User) =>
                    `${target.toString()} has been added to the blacklist`
            },
            UNBLACKLIST: {
                INVALID: (target: User) =>
                    `${target.toString()} is not blacklisted in this server`,
                SUCCESS: (target: User) =>
                    `${target.toString()} has been removed from the blacklist`
            }
        },
        CONFIG: {
            NOTSET: "Not set",
            ADMINROLE: (old: Role | string, target: Role) =>
                `Old Admin Role: ${old.toString()}\nNew Admin Role: ${target.toString()}`
        }
    },
    COMMAND_HANDLER: {
        PROMPT: {
            MODIFY_START: (str: string) =>
                `${str}\n\nType \`cancel\` to cancel the command.`,
            MODIFY_RETRY: (str: string) =>
                `${str}\n\nType \`cancel\` to cancel the command.`,
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
