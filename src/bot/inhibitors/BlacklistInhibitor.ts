import { Inhibitor } from "discord-akairo";
import { Message } from "discord.js";
import { SETTINGS } from "../../lib/constants";

export default class BlacklistInhibitor extends Inhibitor {
    public constructor() {
        super("blacklist", {
            reason: "blacklist"
        });
    }

    public exec(message: Message) {
        if (this.client.isOwner(message.author.id)) {
            return false;
        }
        const blacklist = this.client.settings.get(
            message.guild!,
            SETTINGS.BLACKLIST,
            [""]
        );
        return blacklist.includes(message.author.id);
    }
}
