import * as alt from 'alt-server';
import { Account } from '../../interfaces/account';
import { Permission } from '../../../shared/utility/enums';
import { getUniquePlayerHash } from '../../utility/encryption';
import { Database, getDatabase } from 'simplymongo';
import { DefaultConfig } from '../../configs/settings';
import { distance2d } from '../../../shared/utility/usefull';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import emit from './emit';
import save from './save';
import dataUpdater from './data-pdater';
import safe from './safe';
import sync from './sync';
import { ATHENA_EVENTS_PLAYER } from '../../enums/athena';
import { ActionMenu } from '../../../shared/interfaces/actions';
import { playerFuncs } from '../player';
import { Collections } from '../../interfaces/collections';

const db: Database = getDatabase();

async function account(p: alt.Player, accountData: Partial<Account>): Promise<void> {
    if (!accountData.permissionLevel) {
        accountData.permissionLevel = Permission.NONE;
        db.updatePartialData(accountData._id, { permissionLevel: Permission.NONE }, Collections.Accounts);
    }
    if (!accountData.quickToken || Date.now() > accountData.quickTokenExpiration || p.needsQT) {
        const qt: string = getUniquePlayerHash(p, p.discord.id);
        db.updatePartialData(
            accountData._id,
            {
                quickToken: qt,
                quickTokenExpiration: Date.now() + 60000 * 60 * 48
            },
            Collections.Accounts
        );
        alt.emitClient(p, SYSTEM_EVENTS.QUICK_TOKEN_UPDATE, p.discord.id);
    }
    emit.meta(p, 'permissionLevel', accountData.permissionLevel);
    p.accountData = accountData;
}

function actionMenu(player: alt.Player, actionMenu: ActionMenu) {
    alt.emitClient(player, SYSTEM_EVENTS.SET_ACTION_MENU, actionMenu);
}

function dead(p: alt.Player, killer: alt.Player = null, weaponHash: any = null): void {
    p.spawn(p.pos.x, p.pos.y, p.pos.z, 0);

    if (!p.data.isUnconscious) {
        p.data.isUnconscious = true;
        emit.meta(p, 'isUnconscious', true);
        save.field(p, 'isUnconscious', true);
        alt.log(`(${p.id}) ${p.data.name} has died.`);
    }

    if (!p.nextUnconsciuosSpawn) {
        p.nextUnconsciuosSpawn = Date.now() + 180000;
    }
    alt.emit(ATHENA_EVENTS_PLAYER.DIED, p);
}

async function firstConnect(p: alt.Player): Promise<void> {
    if (!p || !p.valid) {
        return;
    }

    if (process.env.ATHENA_READY === 'false') {
        p.kick('Still warming up...');
        return;
    }

    const pos = { ...DefaultConfig.CHARACTER_SELECT_POS };

    p.dimension = p.id + 1;
    p.pendingLogin = true;

    dataUpdater.init(p, null);
    safe.setPosition(p, pos.x, pos.y, pos.z);
    sync.time(p);
    sync.weather(p);

    alt.setTimeout(() => {
        if (!p || !p.valid) return;
        alt.emitClient(p, SYSTEM_EVENTS.QUICK_TOKEN_FETCH);
    }, 500);
}

function frozen(p: alt.Player, value: boolean): void {
    alt.emitClient(p, SYSTEM_EVENTS.PLAYER_SET_FREEZE, value);
}

function respawned(p: alt.Player, position: alt.Vector3 = null): void {
    p.nextUnconsciuosSpawn = null;
    p.data.isUnconscious = false;
    emit.meta(p, 'isUnconscious', false);
    save.field(p, 'isUnconscious', false);

    let nearestHopsital = position;
    if (!position) {
        const hospitals = [...DefaultConfig.HOSPITALS_SPAWNS];
        let index = 0;
        let lastDistance = distance2d(p.pos, hospitals[0]);
        for (let i = 1; i < hospitals.length; i++) {
            const distanceCalc = distance2d(p.pos, hospitals[i]);
            if (distanceCalc > lastDistance) continue;
            lastDistance = distanceCalc;
            index = i;
        }
        nearestHopsital = hospitals[index] as alt.Vector3;

        //if (DefaultConfig.RESPAWN_LOSE_WEAPONS) playerFuncs.inventory.removeAllWeapons(p);
    }

    safe.setPosition(p, nearestHopsital.x, nearestHopsital.y, nearestHopsital.z);
    p.spawn(nearestHopsital.x, nearestHopsital.y, nearestHopsital.z, 0);

    alt.nextTick(() => {
        p.clearBloodDamage();
        safe.addHealth(p, 3500, true);
        safe.addArmour(p, 0, true);
    });
    alt.emit(ATHENA_EVENTS_PLAYER.SPAWNED, p);
}

export default {
    account,
    actionMenu,
    dead,
    firstConnect,
    frozen,
    respawned
};
