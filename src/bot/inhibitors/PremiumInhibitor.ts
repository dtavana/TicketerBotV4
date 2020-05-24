import { Inhibitor, Command } from "discord-akairo";
import { Message } from "discord.js";
import {
    EMBEDS,
    MESSAGES,
    PREMIUM_COMMANDS,
    SETTINGS
} from "../../lib/constants";

export default class PremiumInhibitor extends Inhibitor {
    public constructor() {
        super("premium", {
            reason: "premium"
        });
    }

    public exec(message: Message, command: Command) {
        if (!message.guild) return false;
        if (PREMIUM_COMMANDS.includes(command.id)) {
            const premium = this.client.settings.get(
                message.guild,
                SETTINGS.PREMIUM,
                false
            );
            if (!premium) {
                message.util?.send(
                    EMBEDS.FAILURE().setDescription(
                        MESSAGES.PREMIUM_BLOCKED(message.guild.prefix!)
                    )
                );
            }
            return !premium;
        }
        return false;
    }
}
