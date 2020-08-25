import { Command } from "discord-akairo";
import { Message } from "discord.js";
import {
    COMMAND_CATEGORIES,
    COMMAND_DESCRIPTIONS,
    COMMAND_NAMES,
    EMBEDS,
    MESSAGES
} from "../../../lib/constants";
import PremiumManager from "../../managers/PremiumManager";

export default class WithdrawCommand extends Command {
    public constructor() {
        super(COMMAND_NAMES.CREDITS.WITHDRAW, {
            aliases: [COMMAND_NAMES.CREDITS.WITHDRAW],
            category: COMMAND_CATEGORIES.CREDITS,
            description: {
                content: COMMAND_DESCRIPTIONS.CREDITS.WITHDRAW,
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
        const guildCredit = await this.client.premium.getCreditByGuild(
            message.guild!
        );
        if (guildCredit === null) {
            return message.util?.send(
                EMBEDS.FAILURE().setDescription(
                    MESSAGES.COMMANDS.CREDITS.WITHDRAW.ERRORS.CREDITNOTFOUND(
                        message.author
                    )
                )
            );
        }
        if (guildCredit.OWNERID !== message.author.id) {
            return message.util?.send(
                EMBEDS.FAILURE().setDescription(
                    MESSAGES.COMMANDS.CREDITS.WITHDRAW.ERRORS.NOTCREDITOWNER(
                        message.author
                    )
                )
            );
        }
        await this.client.premium.deactivateCredit(guildCredit.IDENTIFIER);
        return message.util?.send(
            EMBEDS.SUCCESS().setDescription(
                MESSAGES.COMMANDS.CREDITS.WITHDRAW.SUCCESS(
                    message.author,
                    guildCredit.IDENTIFIER
                )
            )
        );
    }
}
