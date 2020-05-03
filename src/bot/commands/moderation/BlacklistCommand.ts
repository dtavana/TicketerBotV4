import { Command } from "discord-akairo";
import { Message } from "discord.js";
import {
    COMMAND_CATEGORIES,
    COMMAND_DESCRIPTIONS,
    SETTINGS,
    EMBEDS,
    MESSAGES,
    COMMAND_NAMES
} from "../../../lib/constants";
import { User } from "discord.js";

export default class BlacklistCommand extends Command {
    public constructor() {
        super(COMMAND_NAMES.MODERATION.BLACKLIST, {
            aliases: [COMMAND_NAMES.MODERATION.BLACKLIST],
            category: COMMAND_CATEGORIES.MODERATION,
            description: COMMAND_DESCRIPTIONS.MODERATION.BLACKLIST,
            args: [
                {
                    id: "target",
                    type: "user"
                }
            ]
        });
    }

    public async exec(message: Message, { target }: { target: User }) {
        const blacklist: string[] = this.client.settings.get(
            message.guild,
            SETTINGS.BLACKLIST,
            []
        );
        if (blacklist.includes(target.id)) {
            return await message.channel.send(
                EMBEDS.FAILURE().setDescription(
                    MESSAGES.COMMANDS.MODERATION.BLACKLIST.INVALID(target)
                )
            );
        } else {
            blacklist.push(target.id);
            await this.client.settings.set(
                message.guild,
                SETTINGS.BLACKLIST,
                blacklist
            );
            return await message.channel.send(
                EMBEDS.SUCCESS().setDescription(
                    MESSAGES.COMMANDS.MODERATION.BLACKLIST.SUCCESS(target)
                )
            );
        }
    }
}
