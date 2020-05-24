import { Inhibitor, Command } from "discord-akairo";
import { Message } from "discord.js";
import {
    COMMAND_NAMES,
    EMBEDS,
    MAX_PREMIUM_TICKETCHANNELS,
    MAX_REGULAR_TICKETCHANNELS,
    MESSAGES,
    SETTINGS
} from "../../lib/constants";

import { TicketerChannel } from "../../models/TicketerChannel";

export default class TicketChannelInhibitor extends Inhibitor {
    public constructor() {
        super("ticketchannel", {
            reason: "ticketchannel"
        });
    }

    public exec(message: Message, command: Command) {
        if (!message.guild) return false;
        if (
            command.id !==
            COMMAND_NAMES.CONFIG.TICKET_CHANNEL_CONFIG.TICKETCHANNEL
        ) {
            return false;
        }
        const ticketChannels: Map<
            string,
            TicketerChannel
        > = this.client.settings.get(
            message.guild,
            SETTINGS.TICKETCHANNELS,
            new Map<string, TicketerChannel>()
        );
        const premium = this.client.settings.get(
            message.guild,
            SETTINGS.PREMIUM,
            false
        );
        if (premium) {
            if (ticketChannels.size >= MAX_PREMIUM_TICKETCHANNELS) {
                message.util?.send(
                    EMBEDS.FAILURE().setDescription(
                        MESSAGES.MAXTICKETCHANNELS(
                            MAX_PREMIUM_TICKETCHANNELS,
                            true,
                            message.guild.prefix!
                        )
                    )
                );
                return true;
            }
        } else if (ticketChannels.size >= 1) {
            message.util?.send(
                EMBEDS.FAILURE().setDescription(
                    MESSAGES.MAXTICKETCHANNELS(
                        MAX_REGULAR_TICKETCHANNELS,
                        false,
                        message.guild.prefix!
                    )
                )
            );
            return true;
        }
        return false;
    }
}
