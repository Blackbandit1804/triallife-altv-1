import * as alt from 'alt-client';
declare function carHorn(v: alt.Vehicle, numberOfTimes: number, lengthOfHorn: number): Promise<void>;
declare function lights(v: alt.Vehicle, numberOfTimes: number, delay: number): Promise<void>;
declare const _default: {
    carHorn: typeof carHorn;
    lights: typeof lights;
};
export default _default;
