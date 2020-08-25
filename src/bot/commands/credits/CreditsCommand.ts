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
import { User } from "discord.js";

export default class CreditsCommand extends Command {
    public constructor() {
        super(COMMAND_NAMES.CREDITS.CREDITS, {
            aliases: [COMMAND_NAMES.CREDITS.CREDITS],
            category: COMMAND_CATEGORIES.CREDITS,
            description: {
                content: COMMAND_DESCRIPTIONS.CREDITS.CREDITS,
                usage: ""
            },
            channel: "guild",
            args: [
                {
                    id: "target",
                    match: "option",
                    flag: ["--t", "--target"],
                    type: "user"
                }
            ]
        });
    }

    public async exec(message: Message, { target }: { target: User }) {
        let targetId = message.author.id;
        if (target !== null) {
            if (this.client.isOwner(message.author)) {
                targetId = target.id;
            }
        }
        const allCredits = await this.client.premium.getCreditsByOwner(
            targetId
        );
        const res = EMBEDS.SUCCESS();
        let cnt = 1;
        for (const credit of allCredits) {
            res.addField(
                `**Credit #${cnt}**`,
                PremiumManager.creditToString(credit)
            );
            cnt++;
        }
        return message.util?.send(res);
    }
}
