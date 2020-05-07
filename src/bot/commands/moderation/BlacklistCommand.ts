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
            channel: "guild",
            args: [
                {
                    id: "target",
                    type: "user",
                    prompt: {
                        start: (message: Message) =>
                            MESSAGES.COMMANDS.MODERATION.BLACKLIST.PROMPT.START(
                                message.author
                            ),
                        retry: (message: Message) =>
                            MESSAGES.COMMANDS.MODERATION.BLACKLIST.PROMPT.RETRY(
                                message.author
                            )
                    }
                }
            ]
        });
    }

    public async exec(message: Message, { target }: { target: User }) {
        if (target.bot) {
            return await message.util?.send(
                EMBEDS.FAILURE().setDescription(
                    MESSAGES.COMMANDS.MODERATION.BLACKLIST.NOBOT()
                )
            );
        }
        const blacklist: string[] = this.client.settings.get(
            message.guild!,
            SETTINGS.BLACKLIST,
            []
        );
        if (blacklist.includes(target.id)) {
            return await message.util?.send(
                EMBEDS.FAILURE().setDescription(
                    MESSAGES.COMMANDS.MODERATION.BLACKLIST.INVALID(target)
                )
            );
        } else {
            blacklist.push(target.id);
            await this.client.settings.set(
                message.guild!,
                SETTINGS.BLACKLIST,
                blacklist
            );
            return message.util?.send(
                EMBEDS.SUCCESS().setDescription(
                    MESSAGES.COMMANDS.MODERATION.BLACKLIST.SUCCESS(target)
                )
            );
        }
    }
}
