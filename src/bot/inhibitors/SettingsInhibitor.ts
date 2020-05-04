import { Inhibitor } from "discord-akairo";
import { Message } from "discord.js";
import { COMMAND_CATEGORIES, SETTINGS_PERMISSION } from "../../lib/constants";
import { Command } from "discord-akairo";

export default class SettingsInhibitor extends Inhibitor {
    public constructor() {
        super("settings", {
            reason: "settings"
        });
    }

    public exec(message: Message, command: Command) {
        if (!message.guild) return false;
        if (command.categoryID !== COMMAND_CATEGORIES.CONFIG) {
            return false;
        }
        const hasPermission = message.member?.hasPermission(
            SETTINGS_PERMISSION,
            { checkAdmin: true, checkOwner: true }
        );
        return !hasPermission;
    }
}
