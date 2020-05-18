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
import { CategoryChannel } from "discord.js";
import TicketerChannel, {
    TicketerChannel as TicketerChannelClass
} from "../../../../models/TicketerChannel";
import { DiscordAPIError, Constants } from "discord.js";

export default class TicketChannelCommand extends Command {
    public constructor() {
        super(COMMAND_NAMES.CONFIG.TICKET_CHANNEL_CONFIG.TICKETCHANNEL, {
            aliases: [
                COMMAND_NAMES.CONFIG.TICKET_CHANNEL_CONFIG.TICKETCHANNEL,
                "new-ticket-channel"
            ],
            category: COMMAND_CATEGORIES.TICKET_CHANNEL_CONFIG,
            description:
                COMMAND_DESCRIPTIONS.CONFIG.TICKET_CHANNEL_CONFIG.TICKETCHANNEL,
            channel: "guild",
            args: [
                {
                    id: "target",
                    type: "string",
                    prompt: {
                        start: (message: Message) =>
                            MESSAGES.COMMANDS.CONFIG.TICKET_CHANNEL_CONFIG.TICKETCHANNEL.PROMPT.START(
                                message.author
                            ),
                        retry: (message: Message) =>
                            MESSAGES.COMMANDS.CONFIG.TICKET_CHANNEL_CONFIG.TICKETCHANNEL.PROMPT.RETRY(
                                message.author
                            )
                    }
                },
                {
                    id: "category",
                    type: "boolean",
                    default: true
                }
            ]
        });
    }

    public async exec(
        message: Message,
        { target, category }: { target: string; category: boolean }
    ) {
        let createdCategory: CategoryChannel | string | undefined = undefined;
        if (category) {
            try {
                createdCategory = await message.guild?.channels.create(
                    `${target}-category`,
                    {
                        type: "category",
                        position: 0,
                        reason: "Creating Ticketer Channel Category"
                    }
                );
                createdCategory = createdCategory?.id;
            } catch (error) {
                if (error instanceof DiscordAPIError) {
                    if (
                        error.code === Constants.APIErrors.MISSING_PERMISSIONS
                    ) {
                        return message.util?.send(
                            EMBEDS.FAILURE().setDescription(
                                MESSAGES.COMMANDS.CONFIG.TICKET_CHANNEL_CONFIG
                                    .TICKETCHANNEL.ERRORS.MISSING_PERMISSIONS
                            )
                        );
                    }
                }
                this.client.logger.error(error.message);
                return message.util?.send(
                    EMBEDS.FAILURE().setDescription(MESSAGES.ERRORS.DEFAULT)
                );
            }
        }
        let channel;
        try {
            channel = await message.guild?.channels.create(target, {
                parent: createdCategory,
                reason: "Creating Ticketer Channel"
            });
        } catch (error) {
            if (error instanceof DiscordAPIError) {
                if (error.code === Constants.APIErrors.MISSING_PERMISSIONS) {
                    return message.util?.send(
                        EMBEDS.FAILURE().setDescription(
                            MESSAGES.COMMANDS.CONFIG.TICKET_CHANNEL_CONFIG
                                .TICKETCHANNEL.ERRORS.MISSING_PERMISSIONS
                        )
                    );
                }
            }
            this.client.logger.error(error.message);
            return message.util?.send(
                EMBEDS.FAILURE().setDescription(MESSAGES.ERRORS.DEFAULT)
            );
        }
        const guildMap = this.client.settings.get(
            message.guild!,
            SETTINGS.TICKETCHANNELS,
            new Map<string, TicketerChannelClass>()
        );
        const newTicketerChannel = new TicketerChannel({
            GUILDID: message.guild!.id,
            CHANNELID: channel!.id,
            CATEGORYID: createdCategory
        });
        guildMap.set(channel!.id, newTicketerChannel);
        await this.client.settings.set(
            message.guild!,
            SETTINGS.TICKETCHANNELS,
            guildMap
        );
        return message.util?.send(
            EMBEDS.SUCCESS().setDescription(
                MESSAGES.COMMANDS.CONFIG.TICKET_CHANNEL_CONFIG.TICKETCHANNEL.SUCCESS(
                    channel!.toString()
                )
            )
        );
    }
}
