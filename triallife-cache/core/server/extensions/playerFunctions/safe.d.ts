import * as alt from 'alt-server';
declare function setPosition(player: alt.Player, x: number, y: number, z: number): void;
declare function addArmour(p: alt.Player, value: number, exactValue?: boolean): void;
declare function addBlood(player: alt.Player, value: number): void;
declare function addFood(player: alt.Player, value: number): void;
declare function addWater(player: alt.Player, value: number): void;
declare function addMood(player: alt.Player, value: number): void;
declare const _default: {
    setPosition: typeof setPosition;
    addArmour: typeof addArmour;
    addBlood: typeof addBlood;
    addFood: typeof addFood;
    addWater: typeof addWater;
    addMood: typeof addMood;
};
export default _default;
