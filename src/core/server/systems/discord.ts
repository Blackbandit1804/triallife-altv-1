import Discord from 'discord.js';
import { DEFAULT_CONFIG } from '../tlrp/main';
import Logger from '../utility/tlrp-logger';
import { OptionsManager } from './options';

export class DiscordManager {
    static client: Discord.Client = new Discord.Client({
        ws: { intents: new Discord.Intents(Discord.Intents.ALL) }
    });

    static whitelistRole = process.env.WHITELIST_ROLE ? process.env.WHITELIST_ROLE : null;
    static guild: Discord.Guild;

    static populateEndpoints() {
        DiscordManager.client.on('ready', DiscordManager.ready);
        DiscordManager.client.on('guildMemberUpdate', DiscordManager.userUpdate);
        DiscordManager.client.login(process.env.DISCORD_BOT);
    }

    static ready() {
        Logger.info(`Discord Bot Connected Successfully`);

        if (DEFAULT_CONFIG.WHITELIST && !DiscordManager.whitelistRole) {
            Logger.error(`.env file is missing WHITELIST_ROLE identifaction for auto-whitelist.`);
            return;
        }

        if (!process.env.DISCORD_SERVER_ID) {
            Logger.warning(`DISCORD_SERVER_ID is not defined. You will not be able to use messaging services.`);
            return;
        }

        DiscordManager.guild = DiscordManager.client.guilds.cache.get(process.env.DISCORD_SERVER_ID);
    }

    static userUpdate(oldUser: Discord.GuildMember, newUser: Discord.GuildMember) {
        try {
            const userFullName = `${newUser.user.username}#${newUser.user.discriminator}`;
            const currentMember = DiscordManager.guild.members.cache.get(newUser.user.id);
            const hasRole = currentMember.roles.cache.find((role) => role.id === process.env.WHITELIST_ROLE);

            if (!hasRole) {
                const didRemove = OptionsManager.removeFromWhitelist(currentMember.user.id);

                if (didRemove) {
                    Logger.log(`${userFullName} was removed from the whitelist.`);
                }

                return;
            }

            const didAdd = OptionsManager.addToWhitelist(currentMember.user.id);
            if (didAdd) {
                Logger.log(`${userFullName} was added to the whitelist.`);
            }
        } catch (err) {
            Logger.warning(`Could not whitelist a Discord User. Turn on integrations and wait a few hours.`);
        }
    }

    /**
     * Send a message to a Discord Channel.
     * @static
     * @param {string} channel_id
     * @param {string} message
     * @return {*}
     * @memberof DiscordManager
     */
    static sendToChannel(channel_id: string, message: string) {
        if (!DiscordManager.guild) {
            Logger.error(`You do not currently have a Discord Bot Setup for sending messages.`);
            return;
        }

        const channel = DiscordManager.guild.channels.cache.find((x) => x.id === channel_id) as Discord.TextChannel;
        if (!channel) {
            Logger.error(`Channel does not exist.`);
            return;
        }

        channel.send(message);
    }
}

export default function loader() {
    if (DEFAULT_CONFIG.USE_DISCORD_BOT) {
        if (!process.env.DISCORD_BOT) {
            Logger.error(
                `.env is missing DISCORD_BOT secret for logging in. Don't forget to add WHITELIST_ROLE as well.`
            );
            return;
        }

        DiscordManager.populateEndpoints();
    }
}
