import * as alt from 'alt-server';
import * as sm from 'simplymongo';
import { SystemEvent } from '../../shared/enums/system';
import { ViewDiscord } from '../../shared/enums/views';
import { Permissions } from '../../shared/enums/permission';
import { DefaultConfig } from '../configs/settings';
import { playerFuncs } from '../extensions/player';
import { Account, DiscordUser } from '../interfaces/account';
import { getUniquePlayerHash } from '../utility/encryption';
import { goToCharacterSelect } from '../views/characters';
import { OptionsController } from './options';
import { vehicleFuncs } from '../extensions/vehicle';
import { Collections } from '../interfaces/collections';
import '../views/login';
import './tick';
import './voice';
import './job';
import './marker';
import './textlabel';

const db: sm.Database = sm.getDatabase();

export class LoginController {
    static async tryLogin(player: alt.Player, data: Partial<DiscordUser>, account: Partial<Account>): Promise<void> {
        delete player.pendingLogin;
        delete player.discordToken;
        if (DefaultConfig.WHITELIST) {
            if (!OptionsController.isWhitelisted(data.id)) {
                player.kick(`You are not currently whitelisted.`);
                return;
            }
        }
        player.setMeta('Athena:Discord:Info', data);
        if (data.username) alt.log(`[3L:RP] (${player.id}) ${data.username} has authenticated.`);
        if (account && account.discord) alt.log(`[3L:RP] (${player.id}) Discord ${account.discord} has logged in with a Quick Token `);
        const currentPlayers = [...alt.Player.all];
        const index = currentPlayers.findIndex((p) => p.discord && p.discord.id === data.id && p.id !== player.id);
        if (index >= 1) {
            player.kick('That ID is already logged in.');
            return;
        }
        player.discord = data as DiscordUser;
        alt.emitClient(player, ViewDiscord.Close);
        if (!account) {
            let accountData: Partial<Account> | null = await db.fetchData<Account>('discord', data.id, Collections.Accounts);
            if (!accountData) {
                const newDocument: Partial<Account> = {
                    discord: player.discord.id,
                    ips: [player.ip],
                    hardware: [player.hwidHash, player.hwidExHash],
                    lastLogin: Date.now(),
                    permissionLevel: Permissions.NONE
                };
                account = await db.insertData<Partial<Account>>(newDocument, Collections.Accounts, true);
            } else account = accountData;
        }
        if (account.banned) {
            player.kick(account.reason);
            return;
        }
        await playerFuncs.set.account(player, account);
        goToCharacterSelect(player);
    }

    static tryDisconnect(player: alt.Player, reason: string): void {
        if (!player || !player.valid || !player.data) return;
        if (player.lastVehicleID !== null && player.lastVehicleID !== undefined) vehicleFuncs.create.despawn(player.lastVehicleID);
        alt.log(`${player.data.name} has logged out.`);
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
        LoginController.tryLogin(player, { id: discord }, account);
    }

    static async handleNoQuickToken(player: alt.Player): Promise<void> {
        player.needsQT = true;
    }
}

alt.onClient(SystemEvent.QUICK_TOKEN_NONE, LoginController.handleNoQuickToken);
alt.onClient(SystemEvent.QUICK_TOKEN_EMIT, LoginController.tryDiscordQuickToken);
alt.on('playerDisconnect', LoginController.tryDisconnect);
alt.on('Discord:Login', LoginController.tryLogin);
