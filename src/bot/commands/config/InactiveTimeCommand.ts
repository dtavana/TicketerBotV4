import { Command } from "discord-akairo";
import { Message } from "discord.js";
import {
    COMMAND_CATEGORIES,
    COMMAND_DESCRIPTIONS,
    COMMAND_NAMES,
    EMBEDS,
    MESSAGES,
    SETTINGS
} from "../../../lib/constants";
import timeConversion from "../../../utils/timeConversion";

export default class InactiveTimeCommand extends Command {
    public constructor() {
        super(COMMAND_NAMES.CONFIG.INACTIVETIME, {
            aliases: [COMMAND_NAMES.CONFIG.INACTIVETIME, "set-inactive-time"],
            category: COMMAND_CATEGORIES.CONFIG,
            description: COMMAND_DESCRIPTIONS.CONFIG.INACTIVETIME,
            channel: "guild",
            args: [
                {
                    id: "target",
                    type: "dynamicInt",
                    prompt: {
                        start: (message: Message) =>
                            MESSAGES.COMMANDS.CONFIG.INACTIVETIME.PROMPT.START(
                                message.author
                            ),
                        retry: (message: Message) =>
                            MESSAGES.COMMANDS.CONFIG.INACTIVETIME.PROMPT.RETRY(
                                message.author
                            )
                    }
                }
            ]
        });
    }

    public async exec(message: Message, { target }: { target: number }) {
        let inactiveTime:
            | number
            | string
            | undefined = await this.client.settings.set(
            message.guild!,
            SETTINGS.INACTIVETIME,
            target
        );
        if (inactiveTime === undefined) {
            inactiveTime = MESSAGES.COMMANDS.CONFIG.NOTSET;
        } else {
            inactiveTime = timeConversion(inactiveTime as number);
        }
        return message.util?.send(
            EMBEDS.SUCCESS().setDescription(
                MESSAGES.COMMANDS.CONFIG.INACTIVETIME.SUCCESS(
                    inactiveTime,
                    timeConversion(target)
                )
            )
        );
    }
}
