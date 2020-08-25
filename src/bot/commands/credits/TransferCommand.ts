import { Command } from "discord-akairo";
import { Message, User } from "discord.js";
import {
    COMMAND_CATEGORIES,
    COMMAND_DESCRIPTIONS,
    COMMAND_NAMES,
    EMBEDS,
    MESSAGES
} from "../../../lib/constants";

export default class TransferCommand extends Command {
    public constructor() {
        super(COMMAND_NAMES.CREDITS.TRANSFER, {
            aliases: [COMMAND_NAMES.CREDITS.TRANSFER],
            category: COMMAND_CATEGORIES.CREDITS,
            description: {
                content: COMMAND_DESCRIPTIONS.CREDITS.TRANSFER,
                usage: "<target>",
                examples: ["@twist", "twist"]
            },
            channel: "guild",
            args: [
                {
                    id: "target",
                    type: "user",
                    prompt: {
                        start: (message: Message) =>
                            MESSAGES.COMMANDS.CREDITS.TRANSFER.PROMPT.START(
                                message.author
                            ),
                        retry: (message: Message) =>
                            MESSAGES.COMMANDS.CREDITS.TRANSFER.PROMPT.RETRY(
                                message.author
                            )
                    }
                }
            ]
        });
    }

    public async exec(message: Message, { target }: { target: User }) {
        const allCredits = await this.client.premium.getCreditsByOwner(
            message.author.id
        );
        const availableCredits = allCredits.filter(
            (credit) => credit.GUILDID === ""
        );
        if (availableCredits.length <= 0) {
            return message.util?.send(
                EMBEDS.FAILURE().setDescription(
                    MESSAGES.COMMANDS.CREDITS.TRANSFER.ERRORS.NO_AVAILABLE_CREDITS(
                        message.author,
                        message.guild?.prefix!
                    )
                )
            );
        }
        const chosenCredit = availableCredits[0];
        await this.client.premium.transferCredit(
            target,
            chosenCredit.IDENTIFIER
        );
        return message.util?.send(
            EMBEDS.SUCCESS().setDescription(
                MESSAGES.COMMANDS.CREDITS.TRANSFER.SUCCESS(
                    message.author,
                    target,
                    chosenCredit.IDENTIFIER
                )
            )
        );
    }
}
