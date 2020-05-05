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

export default class UnblacklistCommand extends Command {
    public constructor() {
        super(COMMAND_NAMES.MODERATION.UNBLACKLIST, {
            aliases: [COMMAND_NAMES.MODERATION.UNBLACKLIST],
            category: COMMAND_CATEGORIES.MODERATION,
            description: COMMAND_DESCRIPTIONS.MODERATION.UNBLACKLIST,
            args: [
                {
                    id: "target",
                    type: "user",
                    prompt: {
                        start: (message: Message) =>
                            MESSAGES.COMMANDS.MODERATION.UNBLACKLIST.PROMPT.START(
                                message.author
                            ),
                        retry: (message: Message) =>
                            MESSAGES.COMMANDS.MODERATION.UNBLACKLIST.PROMPT.RETRY(
                                message.author
                            )
                    }
                }
            ]
        });
    }

    public async exec(message: Message, { target }: { target: User }) {
        let blacklist: string[] = this.client.settings.get(
            message.guild!,
            SETTINGS.BLACKLIST,
            []
        );
        if (!blacklist.includes(target.id)) {
            return await message.util?.send(
                EMBEDS.FAILURE().setDescription(
                    MESSAGES.COMMANDS.MODERATION.UNBLACKLIST.INVALID(target)
                )
            );
        } else {
            blacklist = blacklist.filter((el) => el !== target.id);
            blacklist.length === 0
                ? await this.client.settings.delete(
                      message.guild!,
                      SETTINGS.BLACKLIST
                  )
                : await this.client.settings.set(
                      message.guild!,
                      SETTINGS.BLACKLIST,
                      blacklist
                  );
            return await message.util?.send(
                EMBEDS.SUCCESS().setDescription(
                    MESSAGES.COMMANDS.MODERATION.UNBLACKLIST.SUCCESS(target)
                )
            );
        }
    }
}
