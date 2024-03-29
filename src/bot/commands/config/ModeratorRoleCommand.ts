import { Command } from "discord-akairo";
import { Message, Role } from "discord.js";
import {
    COMMAND_CATEGORIES,
    COMMAND_DESCRIPTIONS,
    COMMAND_NAMES,
    EMBEDS,
    MESSAGES,
    SETTINGS
} from "../../../lib/constants";

export default class ModeratorRoleCommand extends Command {
    public constructor() {
        super(COMMAND_NAMES.CONFIG.MODERATORROLE, {
            aliases: [COMMAND_NAMES.CONFIG.MODERATORROLE, "set-moderator-role"],
            category: COMMAND_CATEGORIES.CONFIG,
            description: {
                content: COMMAND_DESCRIPTIONS.CONFIG.MODERATORROLE,
                usage: "<modRole>",
                examples: ["@test", "test"]
            },
            channel: "guild",
            args: [
                {
                    id: "target",
                    type: "role",
                    prompt: {
                        start: (message: Message) =>
                            MESSAGES.COMMANDS.CONFIG.MODERATORROLE.PROMPT.START(
                                message.author
                            ),
                        retry: (message: Message) =>
                            MESSAGES.COMMANDS.CONFIG.MODERATORROLE.PROMPT.RETRY(
                                message.author
                            )
                    }
                }
            ]
        });
    }

    public async exec(message: Message, { target }: { target: Role }) {
        let moderatorRole: string | undefined = await this.client.settings.set(
            message.guild!,
            SETTINGS.MODERATORROLE,
            target.id
        );
        if (moderatorRole === undefined) {
            moderatorRole = MESSAGES.COMMANDS.CONFIG.NOTSET;
        } else {
            const moderatorRoleResolved = message.guild?.roles.cache.get(
                moderatorRole
            );
            if (!moderatorRoleResolved) {
                moderatorRole = MESSAGES.COMMANDS.CONFIG.NOTSET;
            } else {
                moderatorRole = moderatorRoleResolved.toString();
            }
        }
        return message.util?.send(
            EMBEDS.SUCCESS().setDescription(
                MESSAGES.COMMANDS.CONFIG.MODERATORROLE.SUCCESS(
                    moderatorRole,
                    target.toString()
                )
            )
        );
    }
}
