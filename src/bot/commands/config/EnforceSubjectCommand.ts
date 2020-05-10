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

export default class EnforceSubjectCommand extends Command {
    public constructor() {
        super(COMMAND_NAMES.CONFIG.ENFORCESUBJECT, {
            aliases: [
                COMMAND_NAMES.CONFIG.ENFORCESUBJECT,
                "set-enforce-subject"
            ],
            category: COMMAND_CATEGORIES.CONFIG,
            description: COMMAND_DESCRIPTIONS.CONFIG.ENFORCESUBJECT,
            channel: "guild",
            args: [
                {
                    id: "target",
                    type: "boolean",
                    prompt: {
                        start: (message: Message) =>
                            MESSAGES.COMMANDS.CONFIG.ENFORCESUBJECT.PROMPT.START(
                                message.author
                            ),
                        retry: (message: Message) =>
                            MESSAGES.COMMANDS.CONFIG.ENFORCESUBJECT.PROMPT.RETRY(
                                message.author
                            )
                    }
                }
            ]
        });
    }

    public async exec(message: Message, { target }: { target: boolean }) {
        let enforceSubject: string | undefined = await this.client.settings.set(
            message.guild!,
            SETTINGS.ENFORCESUBJECT,
            target
        );
        if (enforceSubject === undefined) {
            enforceSubject = MESSAGES.COMMANDS.CONFIG.NOTSET;
        }
        return message.util?.send(
            EMBEDS.SUCCESS().setDescription(
                MESSAGES.COMMANDS.CONFIG.ENFORCESUBJECT.SUCCESS(
                    enforceSubject,
                    target.toString()
                )
            )
        );
    }
}
