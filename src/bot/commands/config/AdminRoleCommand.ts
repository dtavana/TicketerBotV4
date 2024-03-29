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

export default class AdminRoleCommand extends Command {
    public constructor() {
        super(COMMAND_NAMES.CONFIG.ADMINROLE, {
            aliases: [COMMAND_NAMES.CONFIG.ADMINROLE, "set-admin-role"],
            category: COMMAND_CATEGORIES.CONFIG,
            description: {
                content: COMMAND_DESCRIPTIONS.CONFIG.ADMINROLE,
                usage: "<adminRole>",
                examples: ["@test"]
            },
            channel: "guild",
            args: [
                {
                    id: "target",
                    type: "role",
                    prompt: {
                        start: (message: Message) =>
                            MESSAGES.COMMANDS.CONFIG.ADMINROLE.PROMPT.START(
                                message.author
                            ),
                        retry: (message: Message) =>
                            MESSAGES.COMMANDS.CONFIG.ADMINROLE.PROMPT.RETRY(
                                message.author
                            )
                    }
                }
            ]
        });
    }

    public async exec(message: Message, { target }: { target: Role }) {
        let adminRole: string | undefined = await this.client.settings.set(
            message.guild!,
            SETTINGS.ADMINROLE,
            target.id
        );
        if (adminRole === undefined) {
            adminRole = MESSAGES.COMMANDS.CONFIG.NOTSET;
        } else {
            const adminRoleResolved = message.guild?.roles.cache.get(adminRole);
            if (!adminRoleResolved) {
                adminRole = MESSAGES.COMMANDS.CONFIG.NOTSET;
            } else {
                adminRole = adminRoleResolved.toString();
            }
        }
        return message.util?.send(
            EMBEDS.SUCCESS().setDescription(
                MESSAGES.COMMANDS.CONFIG.ADMINROLE.SUCCESS(
                    adminRole,
                    target.toString()
                )
            )
        );
    }
}
