import * as alt from 'alt-server';
import { Database, getDatabase } from 'simplymongo';
import { SystemEvent } from '../../shared/utility/enums';
import { Account } from '../interfaces/account';
import { Collections } from '../interfaces/collection';
import Logger from '../utility/logger';

const db: Database = getDatabase();

export class AdminManager {
    static async banPlayer(player: alt.Player, target: alt.Player, reason: string): Promise<boolean> {
        if (!target.account) return false;
        target.kick(`[Gebannt] ${reason}`);
        db.updatePartialData(target.account._id, { banned: true, reason }, Collections.Accounts);
        Logger.info(`(${target.discord.id}) wurde gebannt.`);
        return true;
    }

    static async unbanPlayer(player: alt.Player, discord: string): Promise<boolean> {
        const account = await db.fetchData<Account>('discord', discord, Collections.Accounts);
        if (!account) return false;
        if (!account.hasOwnProperty('discord')) return false;
        await db.updatePartialData(account._id.toString(), { banned: false, reason: null }, Collections.Accounts);
        Logger.info(`(${discord}) wurde entbannt.`);
        return true;
    }
}

alt.onClient(SystemEvent.Player_Ban, AdminManager.banPlayer);
alt.onClient(SystemEvent.Player_Unban, AdminManager.unbanPlayer);
