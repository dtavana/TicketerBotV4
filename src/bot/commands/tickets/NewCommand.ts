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
            return message.util?.send(
                EMBEDS.FAILURE().setDescription(
                    MESSAGES.COMMANDS.TICKETS.NEW.ERRORS.INVALID_TICKET_CHANNEL(
                        message.author,
                        message.guild?.prefix!
                    )
                )
            );
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
                return message.util?.send(
                    EMBEDS.FAILURE().setDescription(
                        MESSAGES.COMMANDS.TICKETS.NEW.ERRORS.TAG_USER_AS_SUBJECT(
                            message.author
                        )
                    )
                );
            }
        } else {
            if (target === DEFAULT_SETTINGS.SUBJECT) {
                const enforceSubject = this.client.settings.get(
                    message.guild!,
                    SETTINGS.ENFORCESUBJECT,
                    false
                );
                if (enforceSubject) {
                    return message.util?.send(
                        EMBEDS.FAILURE().setDescription(
                            MESSAGES.COMMANDS.TICKETS.NEW.ERRORS.SUBJECT_NEEDED(
                                message.author
                            )
                        )
                    );
                }
                subject = target;
                target = message.member!;
            }
        }
        const currentAuthorTickets = this.client.tickets.getTicketsByAuthor(
            message.guild!,
            target as GuildMember
        );
        const maxTickets = ticketChannel.MAXTICKETS;
        if (maxTickets !== -1 && currentAuthorTickets!.size >= maxTickets!) {
            return message.util?.send(
                EMBEDS.FAILURE().setDescription(
                    MESSAGES.COMMANDS.TICKETS.NEW.ERRORS.MAX_TICKETS(
                        message.author
                    )
                )
            );
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
