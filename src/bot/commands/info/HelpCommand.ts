import { Command } from "discord-akairo";
import { Message, MessageEmbed, Permissions } from "discord.js";
import {
    MESSAGES,
    COMMAND_DESCRIPTIONS,
    COMMAND_CATEGORIES,
    COMMAND_NAMES
} from "../../../lib/constants";

export default class HelpCommand extends Command {
    public constructor() {
        super(COMMAND_NAMES.INFO.HELP, {
            aliases: [COMMAND_NAMES.INFO.HELP],
            description: COMMAND_DESCRIPTIONS.INFO.HELP,
            category: COMMAND_CATEGORIES.INFO,
            clientPermissions: [Permissions.FLAGS.EMBED_LINKS],
            ratelimit: 2,
            args: [
                {
                    id: "command",
                    type: "commandAlias"
                }
            ]
        });
    }

    public async exec(message: Message, { command }: { command: Command }) {
        const prefix = message.guild?.prefix;
        if (!command) {
            const embed = new MessageEmbed()
                .setColor(3447003)
                .addField(
                    "❯ Commands",
                    MESSAGES.COMMANDS.INFO.HELP.REPLY(prefix!)
                );

            // eslint-disable-next-line no-loops/no-loops
            for (const category of this.handler.categories.values()) {
                embed.addField(
                    `❯ ${category.id.replace(/(\b\w)/gi, (lc) =>
                        lc.toUpperCase()
                    )}`,
                    `${category
                        .filter((cmd) => cmd.aliases.length > 0)
                        .map((cmd) => `\`${cmd.aliases[0]}\``)
                        .join(" ")}`
                );
            }

            return message.util?.send(embed);
        }

        const embed = new MessageEmbed()
            .setColor(3447003)
            .setTitle(
                `\`${command.aliases[0]} ${command.description.usage || ""}\``
            )
            .addField("❯ Description", command.description.content || "\u200b");

        if (command.aliases.length > 1)
            embed.addField(
                "❯ Aliases",
                `\`${command.aliases.join("` `")}\``,
                true
            );
        if (command.description.examples?.length)
            embed.addField(
                "❯ Examples",
                `\`${command.aliases[0]} ${command.description.examples.join(
                    `\`\n\`${command.aliases[0]} `
                )}\``,
                true
            );

        return message.util?.send(embed);
    }
}
