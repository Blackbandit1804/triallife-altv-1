import * as alt from 'alt-server';
import { TlrpFunctions, WASM } from '../../utility/wasmLoader';
import emit from './emit';
import save from './save';

const wasm = WASM.getFunctions<TlrpFunctions>('tlrp');

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
    if (wasm.TlrpMath.add(p.armour, value) > 100) {
        p.acArmour = 100;
        p.armour = 100;
        return;
    }
    p.acArmour = wasm.TlrpMath.add(p.armour, value);
    p.armour = p.acArmour;
}

function addBlood(p: alt.Player, value: number, exact: boolean = false) {
    adjustAttribute(p, value, 'blood', exact);
}

function addFood(player: alt.Player, value: number, exact: boolean = false) {
    adjustAttribute(player, value, 'food', exact);
}

function addWater(player: alt.Player, value: number, exact: boolean = false) {
    adjustAttribute(player, value, 'water', exact);
}

function addMood(player: alt.Player, value: number, exact: boolean = false) {
    adjustAttribute(player, value, 'mood', exact);
}

function adjustAttribute(player: alt.Player, value: number, name: string, exact: boolean) {
    const minValue: number = name === 'blood' ? 2500 : 0;
    const maxValue: number = name === 'blood' ? 7500 : 100;
    const notExist: boolean = player.data[name] === undefined || player.data[name] === null;
    if (notExist) player.data[name] = name === 'blood' ? 7500 : 100;
    if (exact) player.data[name] = value;
    else player.data[name] += value;
    if (wasm.TlrpMath.isLesser(player.data[name], minValue)) player.data[name] = minValue;
    if (wasm.TlrpMath.isGreater(player.data[name], maxValue)) player.data[name] = maxValue;
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
