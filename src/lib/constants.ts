/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MessageEmbed } from "discord.js";
import TicketerBotClient from "../bot/client/TicketerBot";
import { AkairoClient } from "discord-akairo";

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

export const MESSAGES = {
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
                `Now logged in as ${client.user!.tag} (${
                    client.user!.id
                }). Serving ${client.users.cache.size} users.`,
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
    },
    COMMANDS: {}
};

export const COMMAND_CATEGORIES = {};

export const ROLE_IDS = {};

export const CHANNEL_IDS = {};

export const CLIENT_OPTIONS = {
    DEFAULT_PREFIX: "- ",
    OWNERS: ["112762841173368832"]
};
