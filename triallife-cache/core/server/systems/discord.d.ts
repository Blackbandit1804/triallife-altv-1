import Discord from 'discord.js';
export declare class DiscordController {
    static client: Discord.Client;
    static whitelistRole: string;
    static guild: Discord.Guild;
    static populateEndpoints(): void;
    static ready(): void;
    static userUpdate(oldUser: Discord.GuildMember, newUser: Discord.GuildMember): void;
    static sendToChannel(channel_id: string, message: string): void;
}
export default function loader(): void;
