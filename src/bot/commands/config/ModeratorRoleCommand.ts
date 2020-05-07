import { Command } from "discord-akairo";
import { Message } from "discord.js";
import {
    COMMAND_CATEGORIES,
    COMMAND_DESCRIPTIONS,
    SETTINGS,
    EMBEDS,
    COMMAND_NAMES,
    MESSAGES
} from "../../../lib/constants";
import { Role } from "discord.js";

export default class ModeratorRoleCommand extends Command {
    public constructor() {
        super(COMMAND_NAMES.CONFIG.MODERATORROLE, {
            aliases: [COMMAND_NAMES.CONFIG.MODERATORROLE, "set-moderator-role"],
            category: COMMAND_CATEGORIES.CONFIG,
            description: COMMAND_DESCRIPTIONS.CONFIG.MODERATORROLE,
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
        let moderatorRole:
            | string
            | Role
            | undefined = await this.client.settings.set(
            message.guild!,
            SETTINGS.MODERATORROLE,
            target.id
        );
        if (moderatorRole === undefined) {
            moderatorRole = MESSAGES.COMMANDS.CONFIG.NOTSET;
        } else {
            moderatorRole = message.guild?.roles.cache.get(moderatorRole);
            if (!moderatorRole) {
                moderatorRole = MESSAGES.COMMANDS.CONFIG.NOTSET;
            }
        }
        return message.util?.send(
            EMBEDS.SUCCESS().setDescription(
                MESSAGES.COMMANDS.CONFIG.MODERATORROLE.SUCCESS(
                    moderatorRole,
                    target
                )
            )
        );
    }
}
