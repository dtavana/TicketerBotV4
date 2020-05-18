import { Command } from "discord-akairo";
import { Message } from "discord.js";
import {
    COMMAND_CATEGORIES,
    COMMAND_DESCRIPTIONS,
    SETTINGS,
    EMBEDS,
    COMMAND_NAMES,
    MESSAGES
} from "../../../../lib/constants";
import { Argument } from "discord-akairo";
import { TicketerChannel } from "../../../../models/TicketerChannel";

export default class WelcomeMessageCommand extends Command {
    public constructor() {
        super(COMMAND_NAMES.CONFIG.TICKET_CHANNEL_CONFIG.WELCOMEMESSAGE, {
            aliases: [
                COMMAND_NAMES.CONFIG.TICKET_CHANNEL_CONFIG.WELCOMEMESSAGE,
                "set-welcome-message"
            ],
            category: COMMAND_CATEGORIES.TICKET_CHANNEL_CONFIG,
            description:
                COMMAND_DESCRIPTIONS.CONFIG.TICKET_CHANNEL_CONFIG
                    .WELCOMEMESSAGE,
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
        ticketerChannel.WELCOMEMESSAGE = target;
        const oldMap: Map<string, TicketerChannel> = this.client.settings.get(
            message.guild!,
            SETTINGS.TICKETCHANNELS
        );
        oldMap.set(ticketerChannel.CHANNELID, ticketerChannel);
        this.client.settings.set(
            message.guild!,
            SETTINGS.TICKETCHANNELS,
            oldMap
        );

        return message.util?.send(
            EMBEDS.SUCCESS().setDescription(
                MESSAGES.COMMANDS.CONFIG.TICKET_CHANNEL_CONFIG.WELCOMEMESSAGE.SUCCESS(
                    target
                )
            )
        );
    }
}
