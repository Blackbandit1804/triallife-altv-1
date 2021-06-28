import * as alt from 'alt-server';
import { Account } from '../../interfaces/account';
import { Permission, SystemEvent } from '../../../shared/utility/enums';
import { Database, getDatabase } from 'simplymongo';
import { DefaultConfig } from '../../configs/settings';
import { distance2d } from '../../../shared/utility/usefull';
import emit from './emit';
import save from './save';
import updater from './updater';
import sync from './synchronize';
import { playerFuncs } from '../player';
import { Collections } from '../../interfaces/collection';
import { ActionMenu } from '../../../shared/interfaces/action';
import { TlrpEvent } from '../../utility/enums';
import { getUniquePlayerHash } from '../../utility/usefull';

const db: Database = getDatabase();

async function account(p: alt.Player, account: Partial<Account>): Promise<void> {
    if (!account.permissionLevel) {
        account.permissionLevel = Permission.None;
        db.updatePartialData(account._id, { permissionLevel: Permission.None }, Collections.Accounts);
    }
    if (!account.quickToken || Date.now() > account.quickTokenExpiration || p.needsQT) {
        const qt: string = getUniquePlayerHash(p, p.discord.id);
        db.updatePartialData(
            account._id,
            {
                quickToken: qt,
                quickTokenExpiration: Date.now() + 60000 * 60 * 48
            },
            Collections.Accounts
        );
        alt.emitClient(p, SystemEvent.QuickToken_Update, p.discord.id);
    }
    emit.meta(p, 'permissionLevel', account.permissionLevel);
    p.account = account;
}

function actionMenu(player: alt.Player, actionMenu: ActionMenu) {
    alt.emitClient(player, SystemEvent.Actions_Set, actionMenu);
}

function unconsciouse(p: alt.Player, killer: alt.Player = null, weaponHash: any = null): void {
    p.spawn(p.pos.x, p.pos.y, p.pos.z, 0);
    alt.emit('SaltyChat:SetPlayerAlive', p, false);
    if (!p.data.isUnconsciouse) {
        p.data.isUnconsciouse = true;
        emit.meta(p, 'isUnconsciouse', true);
        save.field(p, 'isUnconsciouse', true);
        alt.log(`(${p.id}) ${p.data.info.name} has become unconsciouse.`);
    }
    alt.setTimeout(() => respawned(p, null), DefaultConfig.RESPAWN_TIME);
    if (!p.nextUnconsciouseSpawn) p.nextUnconsciouseSpawn = Date.now() + DefaultConfig.RESPAWN_TIME;
    alt.emit(TlrpEvent.PLAYER_UNCONSCIOUSE, p);
}

async function firstConnect(p: alt.Player): Promise<void> {
    if (!p || !p.valid) return;
    if (process.env.TLRP_READY === 'false') {
        p.kick('Server fährt noch hoch...');
        return;
    }
    const pos = { ...DefaultConfig.CHARACTER_SELECT_POS };
    p.dimension = p.id + 1;
    p.pendingLogin = true;
    updater.init(p, null);
    save.setPosition(p, pos.x, pos.y, pos.z);
    sync.time(p);
    sync.weather(p);
    alt.setTimeout(() => {
        if (!p || !p.valid) return;
        alt.emitClient(p, SystemEvent.QuickToken_Fetch);
    }, 500);
}

function frozen(p: alt.Player, value: boolean): void {
    alt.emitClient(p, SystemEvent.Player_Freeze, value);
}

function respawned(p: alt.Player, position: alt.Vector3 = null): void {
    p.nextUnconsciouseSpawn = null;
    p.data.isUnconsciouse = false;
    emit.meta(p, 'isUnconsciouse', false);
    save.field(p, 'isUnconsciouse', false);
    let nearestHopsital = position;
    if (!position) {
        const hospitals = [...DefaultConfig.HOSPITAL_SPAWNS];
        let index = 0;
        let lastDistance = distance2d(p.pos, hospitals[0]);
        for (let i = 1; i < hospitals.length; i++) {
            const distanceCalc = distance2d(p.pos, hospitals[i]);
            if (distanceCalc > lastDistance) continue;
            lastDistance = distanceCalc;
            index = i;
        }
        nearestHopsital = hospitals[index] as alt.Vector3;
        if (DefaultConfig.RESPAWN_LOSE_WEAPONS) playerFuncs.inventory.removeAllWeapons(p);
    }
    save.setPosition(p, nearestHopsital.x, nearestHopsital.y, nearestHopsital.z);
    p.spawn(nearestHopsital.x, nearestHopsital.y, nearestHopsital.z, 0);
    alt.nextTick(() => {
        p.clearBloodDamage();
        save.addHealth(p, DefaultConfig.RESPAWN_HEALTH, true);
        save.addHunger(p, 100, true);
        save.addThirst(p, 100, true);
        save.addMood(p, 100, true);
        save.addArmour(p, DefaultConfig.RESPAWN_ARMOUR, true);
        alt.emit('SaltyChat:SetPlayerAlive', p, true);
    });
    alt.emit(TlrpEvent.PLAYER_SPAWNED, p);
}

export default { account, actionMenu, unconsciouse, firstConnect, frozen, respawned };
