/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import { TlrpFunctions, TLRP } from '../../utility/tlrpLoader';
import emit from './emit';
import save from './save';

const tlrp = TLRP.getFunctions<TlrpFunctions>('tlrp');

function setPosition(player: alt.Player, x: number, y: number, z: number): void {
    if (!player.hasModel) {
        player.hasModel = true;
        player.spawn(x, y, z, 0);
        player.model = `mp_m_freemode_01`;
    }
    player.acPosition = new alt.Vector3(x, y, z);
    player.pos = new alt.Vector3(x, y, z);
}

function addArmour(p: alt.Player, value: number, exactValue: boolean = false): void {
    if (exactValue) {
        p.acArmour = value;
        p.armour = value;
        return;
    }
    if (tlrp.Math.add(p.armour, value) > 100) {
        p.acArmour = 100;
        p.armour = 100;
        return;
    }

    p.acArmour = tlrp.Math.add(p.armour, value);
    p.armour = p.acArmour;
}

function addBlood(player: alt.Player, value: number) {
    adjustAttribute(player, value, 'blood');
}

function addFood(player: alt.Player, value: number) {
    adjustAttribute(player, value, 'hunger');
}

function addWater(player: alt.Player, value: number) {
    adjustAttribute(player, value, 'thirst');
}

function addMood(player: alt.Player, value: number) {
    adjustAttribute(player, value, 'mood');
}

function adjustAttribute(player: alt.Player, value: number, key: string) {
    const minValue = key === 'blood' ? 2500 : 0;
    const maxValue = key === 'blood' ? 7500 : 100;
    if (player.data[key] === undefined || player.data[key] === null) player.data[key] = maxValue;
    player.data[key] += value;
    if (tlrp.Math.isLesser(player.data[key], minValue)) player.data[key] = minValue;
    if (tlrp.Math.isGreater(player.data[key], maxValue)) player.data[key] = maxValue;
    emit.meta(player, key, player.data[key]);
    save.field(player, key, player.data[key]);
}

export default {
    setPosition,
    addArmour,
    addBlood,
    addFood,
    addWater,
    addMood
};
