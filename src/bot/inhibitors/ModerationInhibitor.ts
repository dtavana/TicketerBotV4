import { Inhibitor } from "discord-akairo";
import { Message } from "discord.js";
import {
    COMMAND_CATEGORIES,
    SETTINGS,
    SETTINGS_PERMISSION
} from "../../lib/constants";
import { Command } from "discord-akairo";

export default class ModerationInhibitor extends Inhibitor {
    public constructor() {
        super("moderation", {
            reason: "moderation"
        });
    }

    public exec(message: Message, command: Command) {
        if (!message.guild) return false;
        if (command.categoryID !== COMMAND_CATEGORIES.MODERATION) {
            return false;
        }
        const hasPermission = message.member?.hasPermission(
            SETTINGS_PERMISSION,
            { checkAdmin: true, checkOwner: true }
        );
        if (hasPermission) {
            return false;
        }
        const adminRole = this.client.settings.get(
            message.guild,
            SETTINGS.ADMINROLE
        );
        if (!adminRole) {
            return true;
        }
        const hasAdminRole = message.member?.roles.cache.has(adminRole);
        if (!hasAdminRole) {
            return true;
        }
        return false;
    }
}
