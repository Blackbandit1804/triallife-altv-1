import * as alt from 'alt-server';
import { Character } from '../../../shared/interfaces/character';
declare function init(player: alt.Player, data?: Character): void;
declare function updateByKeys(player: alt.Player, dataObject: {
    [key: string]: any;
}, targetDataName?: string): void;
declare const _default: {
    init: typeof init;
    updateByKeys: typeof updateByKeys;
};
export default _default;
