import * as alt from 'alt-server';
import { EconomyTypes } from '../../../shared/enums/economy';
declare function add(player: alt.Player, type: EconomyTypes, amount: number): boolean;
declare function sub(player: alt.Player, type: EconomyTypes, amount: number): boolean;
declare function set(player: alt.Player, type: EconomyTypes, amount: number): boolean;
declare function subAllCurrencies(player: alt.Player, amount: number): boolean;
declare const _default: {
    set: typeof set;
    sub: typeof sub;
    add: typeof add;
    subAllCurrencies: typeof subAllCurrencies;
};
export default _default;
