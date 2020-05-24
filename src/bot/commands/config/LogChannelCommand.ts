import {
    COMMAND_CATEGORIES,
    COMMAND_DESCRIPTIONS,
    COMMAND_NAMES,
    EMBEDS,
    MESSAGES,
    SETTINGS
} from "../../../lib/constants";
import { Message, TextChannel } from "discord.js";
import { Command } from "discord-akairo";

export default class LogChannelCommand extends Command {
    public constructor() {
        super(COMMAND_NAMES.CONFIG.LOGCHANNEL, {
            aliases: [COMMAND_NAMES.CONFIG.LOGCHANNEL, "set-log-channel"],
            category: COMMAND_CATEGORIES.CONFIG,
            description: {
                content: COMMAND_DESCRIPTIONS.CONFIG.LOGCHANNEL,
                usage: "<logChannel>",
                examples: ["#test", "test"]
            },
            channel: "guild",
            args: [
                {
                    id: "target",
                    type: "textChannel",
                    prompt: {
                        start: (message: Message) =>
                            MESSAGES.COMMANDS.CONFIG.LOGCHANNEL.PROMPT.START(
                                message.author
                            ),
                        retry: (message: Message) =>
                            MESSAGES.COMMANDS.CONFIG.LOGCHANNEL.PROMPT.RETRY(
                                message.author
                            )
                    }
                }
            ]
        });
    }

    public async exec(message: Message, { target }: { target: TextChannel }) {
        let textChannel: string | undefined = await this.client.settings.set(
            message.guild!,
            SETTINGS.LOGCHANNEL,
            target.id
        );
        if (textChannel === undefined) {
            textChannel = MESSAGES.COMMANDS.CONFIG.NOTSET;
        } else {
            const textChannelResolved = message.guild?.channels.cache.get(
                textChannel
            );
            if (!textChannelResolved) {
                textChannel = MESSAGES.COMMANDS.CONFIG.NOTSET;
            } else {
                textChannel = textChannelResolved.toString();
            }
        }
        return message.util?.send(
            EMBEDS.SUCCESS().setDescription(
                MESSAGES.COMMANDS.CONFIG.LOGCHANNEL.SUCCESS(
                    textChannel,
                    target.toString()
                )
            )
        );
    }
}
