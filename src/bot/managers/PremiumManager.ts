import { AkairoClient } from "discord-akairo";
import PremiumCredit, {
    PremiumCredit as PremiumCreditClass
} from "../../models/PremiumCredit";
import { Guild } from "discord.js";
import { v4 as uuidv4 } from "uuid";

export default class PremiumManager {
    public ["constructor"]: typeof PremiumManager;

    private client!: AkairoClient;
    private model!: typeof PremiumCredit;

    public constructor(model: typeof PremiumCredit, client: AkairoClient) {
        this.model = model;
        this.client = client;
    }

    public generateKey(): string {
        const rawKey: string = uuidv4();
        return rawKey.substring(0, rawKey.indexOf("-"));
    }

    public async hasPremium(guild: Guild | string) {
        const document = await this.getCreditByGuild(guild);
        return document !== null;
    }

    public async getCreditByGuild(
        guild: Guild | string
    ): Promise<PremiumCreditClass | null> {
        const GUILDID = this.constructor.getGuildId(guild);
        const res = await this.model.findOne({ GUILDID });
        if (res) {
            return res.toObject();
        }
        return null;
    }

    public async getCreditByIdentifier(
        identifer: string
    ): Promise<PremiumCreditClass | null> {
        const res = await this.model.findOne({ IDENTIFIER: identifer });
        return res?.toObject();
    }

    public async getCreditsByOwner(
        user: string
    ): Promise<PremiumCreditClass[]> {
        const res = await this.model.find({ OWNERID: user });
        return res.map((doc) => doc.toObject());
    }

    public async activateCredit(guild: Guild | string, identifer: string) {
        const GUILDID = this.constructor.getGuildId(guild);
        await this.model.findOneAndUpdate(
            { IDENTIFIER: identifer },
            { GUILDID }
        );
    }
    public async deactivateCredit(identifer: string) {
        await this.model.findOneAndUpdate(
            { IDENTIFIER: identifer },
            { GUILDID: "" }
        );
    }

    public async generateAndSaveCredit(owner: string) {
        let exists = true;
        let IDENTIFIER = "";
        while (exists) {
            IDENTIFIER = this.generateKey();
            exists = await this.model.exists({ IDENTIFIER });
        }
        await this.model.create({ IDENTIFIER, OWNERID: owner });
        return IDENTIFIER;
    }

    public static getGuildId(guild: Guild | string): string {
        if (guild instanceof Guild) return guild.id;
        if (guild === "global" || guild === null) return "0";
        if (typeof guild === "string" && /^\d+$/.test(guild)) return guild;
        throw new TypeError(
            'Invalid guild specified. Must be a Guild instance, guild ID, "global", or null.'
        );
    }

    public static creditToString(credit: PremiumCreditClass) {
        if (credit.GUILDID !== "") {
            return `**Key:** \`${credit.IDENTIFIER}\` | **Server ID:** \`${credit.GUILDID}\``;
        }
        return `**Key:** \`${credit.IDENTIFIER}\` | **Server ID:** \`Not Activated\``;
    }
}
