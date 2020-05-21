import { Command } from "discord-akairo";
import { Message } from "discord.js";
import {
    COMMAND_CATEGORIES,
    COMMAND_DESCRIPTIONS,
    COMMAND_NAMES,
    EMBEDS,
    MESSAGES,
    SETTINGS
} from "../../../lib/constants";

export default class TranscriptCommand extends Command {
    public constructor() {
        super(COMMAND_NAMES.CONFIG.TRANSCRIPT, {
            aliases: [COMMAND_NAMES.CONFIG.TRANSCRIPT, "set-transcript"],
            category: COMMAND_CATEGORIES.CONFIG,
            description: COMMAND_DESCRIPTIONS.CONFIG.TRANSCRIPT,
            channel: "guild",
            args: [
                {
                    id: "target",
                    type: "boolean",
                    prompt: {
                        start: (message: Message) =>
                            MESSAGES.COMMANDS.CONFIG.TRANSCRIPT.PROMPT.START(
                                message.author
                            ),
                        retry: (message: Message) =>
                            MESSAGES.COMMANDS.CONFIG.TRANSCRIPT.PROMPT.RETRY(
                                message.author
                            )
                    }
                }
            ]
        });
    }

    public async exec(message: Message, { target }: { target: boolean }) {
        let transcript: string | undefined = await this.client.settings.set(
            message.guild!,
            SETTINGS.TRANSCRIPT,
            target
        );
        if (transcript === undefined) {
            transcript = MESSAGES.COMMANDS.CONFIG.NOTSET;
        }
        return message.util?.send(
            EMBEDS.SUCCESS().setDescription(
                MESSAGES.COMMANDS.CONFIG.TRANSCRIPT.SUCCESS(
                    transcript,
                    target.toString()
                )
            )
        );
    }
}
