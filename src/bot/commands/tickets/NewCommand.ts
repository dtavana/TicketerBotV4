import { Command, Argument } from "discord-akairo";
import { Message, GuildMember } from "discord.js";
import {
    COMMAND_CATEGORIES,
    COMMAND_DESCRIPTIONS,
    SETTINGS,
    EMBEDS,
    MESSAGES,
    COMMAND_NAMES,
    DEFAULT_SETTINGS
} from "../../../lib/constants";

export default class NewCommand extends Command {
    public constructor() {
        super(COMMAND_NAMES.TICKETS.NEW, {
            aliases: [COMMAND_NAMES.TICKETS.NEW, "ticket"],
            category: COMMAND_CATEGORIES.TICKETS,
            description: COMMAND_DESCRIPTIONS.TICKETS.NEW,
            channel: "guild",
            args: [
                {
                    id: "target",
                    type: Argument.union("member", "string"),
                    default: DEFAULT_SETTINGS.SUBJECT
                }
            ]
        });
    }

    public async exec(
        message: Message,
        { target }: { target: GuildMember | string }
    ) {
        const ticketChannels = this.client.settings.get(
            message.guild!,
            SETTINGS.TICKETCHANNELS
        );
        const nonTicketChannel = ticketChannels!.get("");
        const resolvedTicketChannel = ticketChannels!.get(message.channel.id);
        const ticketChannel = resolvedTicketChannel ?? nonTicketChannel;
        if (ticketChannel === undefined) {
            // Return invalid ticket channel
            return console.log(1);
        }

        let subject = DEFAULT_SETTINGS.SUBJECT;

        if (target instanceof GuildMember) {
            const adminRole = this.client.settings.resolveAdminRole(
                message.guild!
            );
            const moderatorRole = this.client.settings.resolveModeratorRole(
                message.guild!
            );
            const hasAdminRole = message.member?.roles.cache.has(
                adminRole?.id ?? ""
            );
            const hadModeratorRole = message.member?.roles.cache.has(
                moderatorRole?.id ?? ""
            );
            if (!hasAdminRole && !hadModeratorRole) {
                // Return can not tag a user as a subject if not an admin
                return console.log(2);
            }
        } else {
            if (target === DEFAULT_SETTINGS.SUBJECT) {
                const enforceSubject = this.client.settings.get(
                    message.guild!,
                    SETTINGS.ENFORCESUBJECT,
                    false
                );
                if (enforceSubject) {
                    return console.log(3);
                }
                subject = target;
                target = message.member!;
            }
        }
        const currentAuthorTickets = this.client.tickets.getTicketsByAuthor(
            message.guild!,
            target as GuildMember
        );
        const maxTickets = this.client.settings.get(
            message.guild!,
            SETTINGS.MAXTICKETS,
            1
        );
        if (maxTickets !== -1 && currentAuthorTickets!.size >= maxTickets) {
            return console.log(4);
        }

        return this.client.tickets.openNewTicket(
            message.guild!,
            message,
            target as GuildMember,
            subject,
            ticketChannel
        );
    }
}
