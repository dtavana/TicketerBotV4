import { Command } from "discord-akairo";
import { Message } from "discord.js";
import {
    COMMAND_CATEGORIES,
    COMMAND_DESCRIPTIONS,
    COMMAND_NAMES,
    EMBEDS
} from "../../../lib/constants";
import { PremiumCredit } from "../../../models/PremiumCredit";

export default class CreditsCommand extends Command {
    public constructor() {
        super(COMMAND_NAMES.CREDITS.CREDITS, {
            aliases: [COMMAND_NAMES.CREDITS.CREDITS],
            category: COMMAND_CATEGORIES.CREDITS,
            description: {
                content: COMMAND_DESCRIPTIONS.CREDITS.CREDITS,
                usage: ""
            },
            channel: "guild"
        });
    }

    public async exec(message: Message) {
        const allCredits = await this.client.premium.getCreditsByOwner(
            message.author.id
        );
        const res = EMBEDS.SUCCESS();
        let cnt = 1;
        for (const credit of allCredits) {
            res.addField(`**Credit #${cnt}**`, this.creditToString(credit));
            cnt++;
        }
        return message.util?.send(res);
    }

    private creditToString(credit: PremiumCredit) {
        if (credit.GUILDID !== "") {
            return `**Key:** \`${credit.IDENTIFIER}\` | **Server ID:** \`${credit.GUILDID}\``;
        }
        return `**Key:** \`${credit.IDENTIFIER}\` | **Server ID:** \`Not Activated\``;
    }
}
