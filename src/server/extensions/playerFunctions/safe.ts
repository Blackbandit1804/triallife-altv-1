import * as alt from 'alt-server';
import emit from './emit';
import save from './save';
import * as TlrpMath from '../math';

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
    if (TlrpMath.add(p.armour, value) > 100) {
        p.acArmour = 100;
        p.armour = 100;
        return;
    }
    p.acArmour = TlrpMath.add(p.armour, value);
    p.armour = p.acArmour;
}

function addBlood(player: alt.Player, value: number) {
    adjustAttribute(player, value, 'blood');
}

function addFood(player: alt.Player, value: number) {
    adjustAttribute(player, -value, 'hunger');
}

function addWater(player: alt.Player, value: number) {
    adjustAttribute(player, -value, 'thirst');
}

function addMood(player: alt.Player, value: number) {
    adjustAttribute(player, -value, 'thirst');
}

function adjustAttribute(player: alt.Player, value: number, name: string) {
    const minValue = name === 'blood' ? 2500 : 0;
    const maxValue = name === 'blood' ? 7500 : 100;
    if (player.data[name] === undefined || player.data[name] === null) player.data[name] = name === 'blood' ? maxValue : minValue;
    player.data[name] = Math.min(maxValue, Math.max(minValue, player.data[name] + value));
    emit.meta(player, name, player.data[name]);
    save.field(player, name, player.data[name]);
}

export default {
    addFood,
    addArmour,
    addBlood,
    addWater,
    addMood,
    setPosition
};
