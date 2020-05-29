import { Command } from "discord-akairo";
import { Message, User } from "discord.js";
import {
    COMMAND_CATEGORIES,
    COMMAND_DESCRIPTIONS,
    COMMAND_NAMES,
    EMBEDS,
    MESSAGES
} from "../../../lib/constants";

export default class SpawnCreditCommand extends Command {
    public constructor() {
        super(COMMAND_NAMES.CREDITS.SPAWN_CREDIT, {
            aliases: [COMMAND_NAMES.CREDITS.SPAWN_CREDIT],
            category: COMMAND_CATEGORIES.CREDITS,
            description: {
                content: COMMAND_DESCRIPTIONS.CREDITS.SPAWN_CREDIT,
                usage: "<target>",
                examples: ["@twist", "twist"]
            },
            channel: "guild",
            args: [
                {
                    id: "target",
                    type: "user",
                    default: (message: Message) => message.author
                }
            ],
            ownerOnly: true
        });
    }

    public async exec(message: Message, { target }: { target: User }) {
        if (target.bot) {
            return message.util?.send(
                EMBEDS.FAILURE().setDescription(
                    MESSAGES.COMMANDS.CREDITS.SPAWN_CREDIT.ERRORS.NOBOT
                )
            );
        }
        const identifier = await this.client.premium.generateAndSaveCredit(
            target.id
        );
        return message.util?.send(
            EMBEDS.SUCCESS().setDescription(
                MESSAGES.COMMANDS.CREDITS.SPAWN_CREDIT.SUCCESS(
                    target,
                    identifier
                )
            )
        );
    }
}
