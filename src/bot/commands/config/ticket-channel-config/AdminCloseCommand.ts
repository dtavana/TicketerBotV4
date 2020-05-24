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

export default class AdminCloseCommand extends Command {
    public constructor() {
        super(COMMAND_NAMES.CONFIG.TICKET_CHANNEL_CONFIG.ADMINCLOSE, {
            aliases: [
                COMMAND_NAMES.CONFIG.TICKET_CHANNEL_CONFIG.ADMINCLOSE,
                "set-admin-close"
            ],
            category: COMMAND_CATEGORIES.TICKET_CHANNEL_CONFIG,
            description: {
                content:
                    COMMAND_DESCRIPTIONS.CONFIG.TICKET_CHANNEL_CONFIG
                        .ADMINCLOSE,
                usage: "<ticketerChannel> <adminClose>",
                examples: ["test true", "test1 false"]
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
                    type: "boolean",
                    prompt: {
                        start: (message: Message) =>
                            MESSAGES.COMMANDS.CONFIG.TICKET_CHANNEL_CONFIG.ADMINCLOSE.PROMPT.START(
                                message.author
                            ),
                        retry: (message: Message) =>
                            MESSAGES.COMMANDS.CONFIG.TICKET_CHANNEL_CONFIG.ADMINCLOSE.PROMPT.RETRY(
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
        }: { ticketerChannel: TicketerChannel; target: boolean }
    ) {
        const adminClose = await this.client.settings.setChannelProp(
            message.guild!,
            ticketerChannel,
            CHANNELMAPSETTINGS.ADMINCLOSE,
            target
        );
        return message.util?.send(
            EMBEDS.SUCCESS().setDescription(
                MESSAGES.COMMANDS.CONFIG.TICKET_CHANNEL_CONFIG.ADMINCLOSE.SUCCESS(
                    adminClose!,
                    target
                )
            )
        );
    }
}
