import { Inhibitor, Command } from "discord-akairo";
import { Message } from "discord.js";
import { EMBEDS, MESSAGES, PREMIUM_COMMANDS } from "../../lib/constants";

export default class PremiumInhibitor extends Inhibitor {
    public constructor() {
        super("premium", {
            reason: "premium"
        });
    }

    public async exec(message: Message, command: Command) {
        if (!message.guild) return false;
        if (PREMIUM_COMMANDS.includes(command.id)) {
            const hasPremium = await this.client.premium.hasPremium(
                message.guild
            );
            if (!hasPremium) {
                message.util?.send(
                    EMBEDS.FAILURE().setDescription(
                        MESSAGES.PREMIUM_BLOCKED(message.guild.prefix!)
                    )
                );
                return true;
            }
            return false;
        }
        return false;
    }
}
