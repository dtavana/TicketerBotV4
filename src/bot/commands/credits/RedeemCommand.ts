import { Command } from "discord-akairo";
import { Message } from "discord.js";
import {
    COMMAND_CATEGORIES,
    COMMAND_DESCRIPTIONS,
    COMMAND_NAMES,
    EMBEDS,
    MESSAGES
} from "../../../lib/constants";

export default class RedeemCommand extends Command {
    public constructor() {
        super(COMMAND_NAMES.CREDITS.REDEEM, {
            aliases: [COMMAND_NAMES.CREDITS.REDEEM],
            category: COMMAND_CATEGORIES.CREDITS,
            description: {
                content: COMMAND_DESCRIPTIONS.CREDITS.REDEEM,
                usage: ""
            },
            channel: "guild",
            userPermissions: (message: Message) => {
                if (message.member !== message.guild!.owner) {
                    return message.util?.send(
                        EMBEDS.FAILURE().setDescription(
                            `${message.author}, this command requires you to be the **guild owner**`
                        )
                    );
                }

                return null;
            }
        });
    }

    public async exec(message: Message) {
        const hasPremium = await this.client.premium.hasPremium(message.guild!);
        if (hasPremium) {
            return message.util?.send(
                EMBEDS.FAILURE().setDescription(
                    MESSAGES.COMMANDS.CREDITS.REDEEM.ERRORS.PREMIUM_ACTIVATED(
                        message.author
                    )
                )
            );
        }
        const allCredits = await this.client.premium.getCreditsByOwner(
            message.author.id
        );
        const availableCredits = allCredits.filter(
            (credit) => credit.GUILDID === ""
        );
        if (availableCredits.length <= 0) {
            return message.util?.send(
                EMBEDS.FAILURE().setDescription(
                    MESSAGES.COMMANDS.CREDITS.REDEEM.ERRORS.NO_AVAILABLE_CREDITS(
                        message.author
                    )
                )
            );
        }
        const chosenCredit = availableCredits[0];
        await this.client.premium.activateCredit(
            message.guild!,
            chosenCredit.IDENTIFIER
        );
        return message.util?.send(
            EMBEDS.SUCCESS().setDescription(
                MESSAGES.COMMANDS.CREDITS.REDEEM.SUCCESS(
                    message.author,
                    chosenCredit.IDENTIFIER
                )
            )
        );
    }
}
