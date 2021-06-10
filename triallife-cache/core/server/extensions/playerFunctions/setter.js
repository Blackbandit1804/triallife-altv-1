import * as alt from 'alt-server';
import { getDatabase } from 'simplymongo';
import { getUniquePlayerHash } from '../../utility/encryption';
import { DEFAULT_CONFIG } from '../../tlrp/config';
import { distance2d } from '../../../shared/utility/vector';
import { SYSTEM_EVENTS, TeamType } from '../../../shared/utility/enums';
import { EVENTS_PLAYER } from '../../enums';
import { playerFuncs } from '../player';
import { Collections } from '../../interface/collections';
import emit from './emit';
import save from './save';
import updater from './updater';
import safe from './safe';
import sync from './sync';
const db = getDatabase();
async function account(player, account) {
    if (!account.team) {
        account.team = TeamType.NONE;
        db.updatePartialData(account._id, { team: TeamType.NONE }, Collections.Accounts);
    }
    if (!account.quickToken || Date.now() > account.quickTokenExpiration || player.needsQT) {
        const quickToken = getUniquePlayerHash(player, player.discord.id);
        const quickTokenExpiration = Date.now() + 60000 * 60 * 48;
        db.updatePartialData(account._id, { quickToken, quickTokenExpiration }, Collections.Accounts);
        alt.emitClient(player, SYSTEM_EVENTS.QUICK_TOKEN_UPDATE, player.discord.id);
    }
    emit.meta(player, 'team', account.team);
    player.account = account;
}
function actionMenu(player, actionMenu) {
    alt.emitClient(player, SYSTEM_EVENTS.SET_ACTION_MENU, actionMenu);
}
function unconscious(player, killer = null, weaponHash = null) {
    player.spawn(player.pos.x, player.pos.y, player.pos.z, 0);
    if (!player.data.isUnconscious) {
        player.data.isUnconscious = true;
        emit.meta(player, 'isUnconscious', true);
        save.field(player, 'isUnconscious', true);
        alt.log(`(${player.id}) ${player.data.name} got unconscious.`);
    }
    if (!player.nextDeathSpawn)
        player.nextDeathSpawn = Date.now() + DEFAULT_CONFIG.RESPAWN_TIME;
    alt.emit(EVENTS_PLAYER.UNCONSCIOUS, player);
}
async function firstConnect(player) {
    if (!player || !player.valid)
        return;
    if (process.env.READY === 'false') {
        player.kick('Server still warming up...');
        return;
    }
    const pos = { ...DEFAULT_CONFIG.CHARACTER_SELECT_POS };
    player.dimension = player.id + 1;
    player.pendingLogin = true;
    updater.init(player, null);
    safe.setPosition(player, pos.x, pos.y, pos.z);
    sync.time(player);
    sync.weather(player);
    alt.setTimeout(() => {
        if (!player || !player.valid)
            return;
        alt.emitClient(player, SYSTEM_EVENTS.QUICK_TOKEN_FETCH);
    }, 500);
}
function frozen(player, value) {
    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_SET_FREEZE, value);
}
function respawned(player, position = null) {
    player.nextDeathSpawn = null;
    player.data.isUnconscious = false;
    emit.meta(player, 'isUnconscious', false);
    save.field(player, 'isUnconscious', false);
    let nearestHopsital = position;
    if (!position) {
        const hospitals = [...DEFAULT_CONFIG.VALID_HOSPITALS];
        let index = 0;
        let lastDistance = distance2d(player.pos, hospitals[0]);
        for (let i = 1; i < hospitals.length; i++) {
            const distanceCalc = distance2d(player.pos, hospitals[i]);
            if (distanceCalc > lastDistance)
                continue;
            lastDistance = distanceCalc;
            index = i;
        }
        nearestHopsital = hospitals[index];
        if (DEFAULT_CONFIG.RESPAWN_LOSE_WEAPONS)
            playerFuncs.inventory.removeAllWeapons(player);
    }
    safe.setPosition(player, nearestHopsital.x, nearestHopsital.y, nearestHopsital.z);
    player.spawn(nearestHopsital.x, nearestHopsital.y, nearestHopsital.z, 0);
    alt.nextTick(() => {
        player.clearBloodDamage();
        safe.addBlood(player, DEFAULT_CONFIG.RESPAWN_HEALTH);
        safe.addArmour(player, DEFAULT_CONFIG.RESPAWN_ARMOUR, true);
    });
    alt.emit(EVENTS_PLAYER.SPAWNED, player);
}
export default {
    account,
    actionMenu,
    unconscious,
    firstConnect,
    frozen,
    respawned
};
