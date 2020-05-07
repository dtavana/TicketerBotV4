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

export default class AdminRoleCommand extends Command {
    public constructor() {
        super(COMMAND_NAMES.CONFIG.ADMINROLE, {
            aliases: [COMMAND_NAMES.CONFIG.ADMINROLE, "set-admin-role"],
            category: COMMAND_CATEGORIES.CONFIG,
            description: COMMAND_DESCRIPTIONS.CONFIG.ADMINROLE,
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
