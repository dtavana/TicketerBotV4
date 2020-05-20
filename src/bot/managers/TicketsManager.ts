import { SETTINGS } from "../../lib/constants";
import { AkairoClient } from "discord-akairo";
import { Guild } from "discord.js";
import { User } from "discord.js";
import { TicketerChannel } from "../../models/TicketerChannel";
import { GuildMember } from "discord.js";
import { OverwriteData } from "discord.js";
import TicketerTicket from "../../models/TicketerTicket";
import { Message } from "discord.js";

export default class TicketsManager {
    private client: AkairoClient;

    public constructor(client: AkairoClient) {
        this.client = client;
    }

    public getTicketChannels(guild: Guild | string) {
        return this.client.settings.get(guild, SETTINGS.TICKETCHANNELS);
    }

    public getTickets(guild: Guild | string) {
        return this.client.settings.get(guild, SETTINGS.TICKETS);
    }

    public getTicketsByAuthor(
        guild: Guild | string,
        author: GuildMember | User
    ) {
        const map = this.getTickets(guild);
        console.log(map);
        map!.forEach((v, k, m) => {
            if (v.AUTHORID !== author.id) delete m[k];
        });
        console.log(map);
        return map;
    }

    public async openNewTicket(
        guild: Guild,
        message: Message,
        author: GuildMember,
        subject: string,
        ticketChannel: TicketerChannel
    ) {
        const ticketPrefix = this.client.settings.get(
            guild,
            SETTINGS.TICKETPREFIX
        );
        const currentTicket = this.client.settings.get(
            guild,
            SETTINGS.CURRENTTICKET
        );
        const adminRole = this.client.settings.resolveAdminRole(guild);
        const moderatorRole = this.client.settings.resolveModeratorRole(guild);
        const permissionOverwrites: OverwriteData[] = [
            {
                id: guild.roles.everyone,
                deny: ["SEND_MESSAGES", "VIEW_CHANNEL"],
                type: "role"
            },
            {
                id: author,
                allow: [
                    "SEND_MESSAGES",
                    "VIEW_CHANNEL",
                    "EMBED_LINKS",
                    "ATTACH_FILES",
                    "READ_MESSAGE_HISTORY"
                ],
                type: "member"
            },
            {
                id: guild.me!,
                allow: [
                    "SEND_MESSAGES",
                    "VIEW_CHANNEL",
                    "EMBED_LINKS",
                    "ATTACH_FILES",
                    "READ_MESSAGE_HISTORY"
                ],
                type: "member"
            }
        ];
        if (adminRole) {
            permissionOverwrites.push({
                id: adminRole,
                allow: [
                    "SEND_MESSAGES",
                    "VIEW_CHANNEL",
                    "EMBED_LINKS",
                    "ATTACH_FILES",
                    "READ_MESSAGE_HISTORY"
                ],
                type: "role"
            });
        }
        if (moderatorRole) {
            permissionOverwrites.push({
                id: moderatorRole,
                allow: [
                    "SEND_MESSAGES",
                    "VIEW_CHANNEL",
                    "EMBED_LINKS",
                    "ATTACH_FILES",
                    "READ_MESSAGE_HISTORY"
                ],
                type: "role"
            });
        }
        const newTicketChannel = await guild.channels.create(
            `${ticketPrefix}-${currentTicket}`,
            {
                topic: `Ticket channel created by Ticketer for ${author.user.tag}`,
                parent: ticketChannel?.CATEGORYID,
                permissionOverwrites,
                reason: `Creating a ticket for ${author.user.tag}`
            }
        );
        const guildMap = this.client.settings.get(guild, SETTINGS.TICKETS);
        const newTicketerTicket = new TicketerTicket({
            GUILDID: guild.id,
            CHANNELID: newTicketChannel.id,
            AUTHORID: author.id,
            SUBJECT: subject,
            PARENTID: ticketChannel.CHANNELID
        });
        guildMap!.set(newTicketerTicket.CHANNELID, newTicketerTicket);
        this.client.settings.set(guild, SETTINGS.TICKETS, guildMap);
        await this.client.settings.set(
            guild,
            SETTINGS.CURRENTTICKET,
            currentTicket! + 1
        );
        // Send to log channel
        console.log(5);
    }
}
