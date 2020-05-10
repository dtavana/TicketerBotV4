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

export default class MaxTicketsCommand extends Command {
    public constructor() {
        super(COMMAND_NAMES.CONFIG.MAXTICKETS, {
            aliases: [COMMAND_NAMES.CONFIG.MAXTICKETS, "set-max-tickets"],
            category: COMMAND_CATEGORIES.CONFIG,
            description: COMMAND_DESCRIPTIONS.CONFIG.MAXTICKETS,
            channel: "guild",
            args: [
                {
                    id: "target",
                    type: "integer",
                    prompt: {
                        start: (message: Message) =>
                            MESSAGES.COMMANDS.CONFIG.MAXTICKETS.PROMPT.START(
                                message.author
                            ),
                        retry: (message: Message) =>
                            MESSAGES.COMMANDS.CONFIG.MAXTICKETS.PROMPT.RETRY(
                                message.author
                            )
                    }
                }
            ]
        });
    }

    public async exec(message: Message, { target }: { target: number }) {
        let maxTickets: string | undefined = await this.client.settings.set(
            message.guild!,
            SETTINGS.MAXTICKETS,
            target
        );
        if (maxTickets === undefined) {
            maxTickets = MESSAGES.COMMANDS.CONFIG.NOTSET;
        }
        return message.util?.send(
            EMBEDS.SUCCESS().setDescription(
                MESSAGES.COMMANDS.CONFIG.MAXTICKETS.SUCCESS(
                    maxTickets,
                    target.toString()
                )
            )
        );
    }
}
