import * as alt from 'alt-server';
import { Character } from '../../../shared/interfaces/character';
declare function saveField(player: alt.Player, fieldName: string, fieldValue: any): Promise<void>;
declare function partial(player: alt.Player, dataObject: Partial<Character>): Promise<void>;
declare function onTick(p: alt.Player): Promise<void>;
declare const _default: {
    field: typeof saveField;
    partial: typeof partial;
    onTick: typeof onTick;
};
export default _default;
