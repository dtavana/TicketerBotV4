import { Command, Argument } from "discord-akairo";
import { Message } from "discord.js";
import {
    CHANNELMAPSETTINGS,
    COMMAND_CATEGORIES,
    COMMAND_DESCRIPTIONS,
    COMMAND_NAMES,
    EMBEDS,
    MESSAGES
} from "../../../../lib/constants";

import { TicketerChannel } from "../../../../models/TicketerChannel";

export default class WelcomeMessageCommand extends Command {
    public constructor() {
        super(COMMAND_NAMES.CONFIG.TICKET_CHANNEL_CONFIG.WELCOMEMESSAGE, {
            aliases: [
                COMMAND_NAMES.CONFIG.TICKET_CHANNEL_CONFIG.WELCOMEMESSAGE,
                "set-welcome-message"
            ],
            category: COMMAND_CATEGORIES.TICKET_CHANNEL_CONFIG,
            description: {
                content:
                    COMMAND_DESCRIPTIONS.CONFIG.TICKET_CHANNEL_CONFIG
                        .WELCOMEMESSAGE,
                usage: "<ticketerChannel> <welcomeMessage>",
                examples: ["test Welcome to support!"]
            },
            channel: "guild",
            args: [
                {
                    id: "ticketerChannel",
                    type: "ticketer-channel",
                    prompt: {
                        start: (message: Message) =>
                            MESSAGES.COMMANDS.TYPES.TICKETER_CHANNEL.START(
                                message.author
                            ),
                        retry: (message: Message) =>
                            MESSAGES.COMMANDS.TYPES.TICKETER_CHANNEL.RETRY(
                                message.author
                            )
                    }
                },
                {
                    id: "target",
                    type: Argument.validate(
                        "string",
                        (_, __, value: string) => value.length <= 1500
                    ),
                    prompt: {
                        start: (message: Message) =>
                            MESSAGES.COMMANDS.CONFIG.TICKET_CHANNEL_CONFIG.WELCOMEMESSAGE.PROMPT.START(
                                message.author
                            ),
                        retry: (message: Message) =>
                            MESSAGES.COMMANDS.CONFIG.TICKET_CHANNEL_CONFIG.WELCOMEMESSAGE.PROMPT.RETRY(
                                message.author
                            )
                    }
                }
            ]
        });
    }

    public async exec(
        message: Message,
        {
            ticketerChannel,
            target
        }: { ticketerChannel: TicketerChannel; target: string }
    ) {
        await this.client.settings.setChannelProp(
            message.guild!,
            ticketerChannel,
            CHANNELMAPSETTINGS.WELCOMEMESSAGE,
            target
        );
        return message.util?.send(
            EMBEDS.SUCCESS().setDescription(
                MESSAGES.COMMANDS.CONFIG.TICKET_CHANNEL_CONFIG.WELCOMEMESSAGE.SUCCESS(
                    target!
                )
            )
        );
    }
}
