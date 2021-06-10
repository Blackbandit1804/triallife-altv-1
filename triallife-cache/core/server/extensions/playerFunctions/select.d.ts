import * as alt from 'alt-server';
import { Character } from '../../../shared/interfaces/character';
declare function selectCharacter(player: alt.Player, characterData: Partial<Character>): Promise<void>;
declare const _default: {
    character: typeof selectCharacter;
};
export default _default;
