import * as alt from 'alt-server';
import { Database, getDatabase } from 'simplymongo';
import { Character, CharacterStats } from '../../../shared/interfaces/character';
import { Collections } from '../../interfaces/collection';
import * as TlrpMath from '../../utility/math';
import emit from './emit';

const db: Database = getDatabase();

async function field(p: alt.Player, fieldName: string, fieldValue: any): Promise<void> {
    if (process.env.TEST) return;
    alt.setTimeout(async () => await db.updatePartialData(p.data._id, { [fieldName]: fieldValue }, Collections.Characters), 0);
}

async function partial(p: alt.Player, dataObject: Partial<Character>): Promise<void> {
    if (process.env.TEST) return;
    alt.setTimeout(async () => await db.updatePartialData(p.data._id, { ...dataObject }, Collections.Characters), 0);
}

async function onTick(p: alt.Player): Promise<void> {
    p.data.pos = p.pos;
    p.data.stats.armour = p.armour;
    field(p, 'pos', p.data.pos);
    field(p, 'stats', p.data.stats);
}

function setPosition(player: alt.Player, x: number, y: number, z: number): void {
    if (!player.hasModel) {
        player.hasModel = true;
        player.spawn(x, y, z, 0);
        player.model = `mp_m_freemode_01`;
    }
    player.acPosition = new alt.Vector3(x, y, z);
    player.pos = new alt.Vector3(x, y, z);
}

function setStats(player: alt.Player, stats: Partial<CharacterStats>): void {
    player.acStats = { ...stats };
}

function addArmour(p: alt.Player, value: number, exactValue: boolean = false): void {
    if (exactValue) {
        p.acStats.armour = value;
        p.armour = value;
        return;
    }
    if (TlrpMath.add(p.armour, value) > 100) {
        p.acStats.armour = 100;
        p.armour = 100;
        return;
    }
    p.acStats.armour = TlrpMath.add(p.armour, value);
    p.armour = p.acStats.armour;
}

function addHealth(player: alt.Player, value: number, exactValue: boolean = false): void {
    if (exactValue) {
        player.acStats.blood = value;
        player.data.stats.blood = value;
        player.health = value <= 2500 ? 0 : 199;
        return;
    }
    if (player.data.stats.blood === undefined || player.data.stats.blood === null) player.data.stats.blood = 7500;
    player.data.stats.blood = Math.max(2500, Math.min(7500, player.data.stats.blood + value));
    player.acStats.blood = player.data.stats.blood;
    player.health = player.data.stats.blood <= 2500 ? 0 : 199;
    emit.meta(player, 'blood', player.data.stats.blood);
    field(player, 'stats', player.data.stats);
}

function addHunger(player: alt.Player, value: number, exactValue: boolean = false): void {
    if (exactValue) {
        player.acStats.hunger = value;
        player.data.stats.hunger = value;
        return;
    }
    if (player.data.stats.hunger === undefined || player.data.stats.hunger === null) player.data.stats.hunger = 100;
    player.data.stats.hunger = Math.max(0, Math.min(100, player.data.stats.hunger + value));
    player.acStats.hunger = player.data.stats.hunger;
    emit.meta(player, 'hunger', player.data.stats.hunger);
    field(player, 'stats', player.data.stats);
}

function addThirst(player: alt.Player, value: number, exactValue: boolean = false): void {
    if (exactValue) {
        player.acStats.thirst = value;
        player.data.stats.thirst = value;
        return;
    }
    if (player.data.stats.thirst === undefined || player.data.stats.thirst === null) player.data.stats.thirst = 100;
    player.data.stats.thirst = Math.max(0, Math.min(100, player.data.stats.thirst + value));
    player.acStats.thirst = player.data.stats.thirst;
    emit.meta(player, 'thirst', player.data.stats.thirst);
    field(player, 'stats', player.data.stats);
}

function addMood(player: alt.Player, value: number, exactValue: boolean = false): void {
    if (exactValue) {
        player.acStats.mood = value;
        player.data.stats.mood = value;
        return;
    }
    if (player.data.stats.mood === undefined || player.data.stats.mood === null) player.data.stats.mood = 100;
    player.data.stats.mood = Math.max(0, Math.min(100, player.data.stats.mood + value));
    player.acStats.mood = player.data.stats.mood;
    emit.meta(player, 'mood', player.data.stats.mood);
    field(player, 'stats', player.data.stats);
}

export default { field, partial, onTick, addHunger, addArmour, addHealth, addThirst, addMood, setPosition, setStats };
