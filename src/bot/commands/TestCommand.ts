import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class TestCommand extends Command {
    public constructor() {
        super("test", {
            aliases: ["test"],
            category: "test"
        });
    }

    public async exec(message: Message) {
        await message.reply("This worked");
    }
}
