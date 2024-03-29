import { Command } from "discord-akairo";
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

export default class MaxTicketsCommand extends Command {
    public constructor() {
        super(COMMAND_NAMES.CONFIG.TICKET_CHANNEL_CONFIG.MAXTICKETS, {
            aliases: [
                COMMAND_NAMES.CONFIG.TICKET_CHANNEL_CONFIG.MAXTICKETS,
                "set-max-tickets"
            ],
            category: COMMAND_CATEGORIES.TICKET_CHANNEL_CONFIG,
            description: {
                content:
                    COMMAND_DESCRIPTIONS.CONFIG.TICKET_CHANNEL_CONFIG
                        .MAXTICKETS,
                usage: "<ticketerChannel> <maxTickets>",
                examples: ["test 1", "test1 -1"]
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
                    type: "integer",
                    prompt: {
                        start: (message: Message) =>
                            MESSAGES.COMMANDS.CONFIG.TICKET_CHANNEL_CONFIG.MAXTICKETS.PROMPT.START(
                                message.author
                            ),
                        retry: (message: Message) =>
                            MESSAGES.COMMANDS.CONFIG.TICKET_CHANNEL_CONFIG.MAXTICKETS.PROMPT.RETRY(
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
        }: { ticketerChannel: TicketerChannel; target: number }
    ) {
        const maxTickets = await this.client.settings.setChannelProp(
            message.guild!,
            ticketerChannel,
            CHANNELMAPSETTINGS.MAXTICKETS,
            target
        );
        return message.util?.send(
            EMBEDS.SUCCESS().setDescription(
                MESSAGES.COMMANDS.CONFIG.TICKET_CHANNEL_CONFIG.MAXTICKETS.SUCCESS(
                    maxTickets! === -1 ? "Unlimited" : maxTickets!,
                    target === -1 ? "Unlimited" : target
                )
            )
        );
    }
}
