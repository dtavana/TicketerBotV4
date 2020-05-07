import { Command } from "discord-akairo";
import { Message } from "discord.js";
import {
    COMMAND_CATEGORIES,
    COMMAND_DESCRIPTIONS,
    SETTINGS,
    EMBEDS,
    COMMAND_NAMES,
    MESSAGES
} from "../../../lib/constants";
import { Argument } from "discord-akairo";

export default class TicketPrefixCommand extends Command {
    public constructor() {
        super(COMMAND_NAMES.CONFIG.TICKETPREFIX, {
            aliases: [COMMAND_NAMES.CONFIG.TICKETPREFIX, "set-ticketer-role"],
            category: COMMAND_CATEGORIES.CONFIG,
            description: COMMAND_DESCRIPTIONS.CONFIG.TICKETPREFIX,
            channel: "guild",
            args: [
                {
                    id: "prefix",
                    type: Argument.validate(
                        "string",
                        (_, __, value: string) => value.length <= 10
                    ),
                    prompt: {
                        start: (message: Message) =>
                            MESSAGES.COMMANDS.CONFIG.TICKETPREFIX.PROMPT.START(
                                message.author
                            ),
                        retry: (message: Message) =>
                            MESSAGES.COMMANDS.CONFIG.TICKETPREFIX.PROMPT.RETRY(
                                message.author
                            )
                    }
                }
            ]
        });
    }

    public async exec(message: Message, { prefix }: { prefix: string }) {
        let ticketPrefix: string | undefined = await this.client.settings.set(
            message.guild!,
            SETTINGS.TICKETPREFIX,
            prefix
        );
        if (ticketPrefix === undefined) {
            ticketPrefix = MESSAGES.COMMANDS.CONFIG.NOTSET;
        }
        return message.util?.send(
            EMBEDS.SUCCESS().setDescription(
                MESSAGES.COMMANDS.CONFIG.TICKETPREFIX.SUCCESS(
                    ticketPrefix,
                    prefix
                )
            )
        );
    }
}
