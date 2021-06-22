import * as alt from 'alt-server';
import * as sm from 'simplymongo';
import { SystemEvent, ViewEvent, Permission } from '../../shared/utility/enums';
import { DefaultConfig } from '../configs/settings';
import { playerFuncs } from '../extensions/player';
import { vehicleFuncs } from '../extensions/vehicle';
import { Account } from '../interfaces/account';
import { Collections } from '../interfaces/collection';
import { DiscordUser } from '../interfaces/discord-user';
import Logger from '../utility/Logger';
import { getUniquePlayerHash } from '../utility/usefull';
import { openCharSelect } from '../views/charselect';
import { OptionsManager } from './options';
import '../views/login';

const db: sm.Database = sm.getDatabase();

export class LoginManager {
    static async tryLogin(player: alt.Player, data: Partial<DiscordUser>, account: Partial<Account>): Promise<void> {
        delete player.pendingLogin;
        delete player.discordToken;
        if (DefaultConfig.WHITELIST) {
            if (!OptionsManager.isWhitelisted(data.id)) {
                player.kick(`Sie sind nicht freigeschlatet`);
                return;
            }
        }
        player.setMeta('tlrp:discord:info', data);
        if (data.username) Logger.log(`(${player.id}) ${data.username} has authenticated.`);
        if (account && account.discord) Logger.log(`(${player.id}) Discord ${account.discord} has logged in with a Quick Token `);
        const currentPlayers = [...alt.Player.all];
        const index = currentPlayers.findIndex((p) => p.discord && p.discord.id === data.id && p.id !== player.id);
        if (index >= 1) {
            player.kick('Diese ID ist bereits im Spiel vorhanden');
            return;
        }
        player.discord = data as DiscordUser;
        alt.emitClient(player, ViewEvent.Discord_Close);
        if (!account) {
            let accountData: Partial<Account> | null = await db.fetchData<Account>('discord', data.id, Collections.Accounts);
            if (!accountData) {
                const newDocument: Partial<Account> = {
                    discord: player.discord.id,
                    ips: [player.ip],
                    hardware: [player.hwidHash, player.hwidExHash],
                    lastLogin: Date.now(),
                    permissionLevel: Permission.None
                };
                account = await db.insertData<Partial<Account>>(newDocument, Collections.Accounts, true);
            } else account = accountData;
        }
        if (account.banned) {
            player.kick(account.reason);
            return;
        }
        await playerFuncs.set.account(player, account);
        openCharSelect(player);
    }

    static tryDisconnect(player: alt.Player, reason: string): void {
        if (!player || !player.valid || !player.data) return;
        if (player.lastVehicleID !== null && player.lastVehicleID !== undefined) vehicleFuncs.create.despawn(player.lastVehicleID);
        Logger.log(`${player.data.info.name} has logged out.`);
        playerFuncs.save.onTick(player);
    }

    static async tryDiscordQuickToken(player: alt.Player, discord: string): Promise<void> {
        if (!discord) return;
        const hashToken: string = getUniquePlayerHash(player, discord);
        const account: Partial<Account> | null = await db.fetchData<Account>('quickToken', hashToken, Collections.Accounts);
        if (!account) {
            player.needsQT = true;
            return;
        }
        if (!account.quickTokenExpiration || Date.now() > account.quickTokenExpiration) {
            player.needsQT = true;
            db.updatePartialData(account._id, { quickToken: null, quickTokenExpiration: null }, Collections.Accounts);
            return;
        }
        LoginManager.tryLogin(player, { id: discord }, account);
    }

    static async handleNoQuickToken(player: alt.Player): Promise<void> {
        player.needsQT = true;
    }
}

alt.onClient(SystemEvent.QuickToken_None, LoginManager.handleNoQuickToken);
alt.onClient(SystemEvent.QuickToken_Emit, LoginManager.tryDiscordQuickToken);
alt.on('playerDisconnect', LoginManager.tryDisconnect);
alt.on('Discord:Login', LoginManager.tryLogin);
