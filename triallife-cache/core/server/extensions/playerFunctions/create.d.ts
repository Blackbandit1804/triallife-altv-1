import * as alt from 'alt-server';
import { CharacterInfo } from '../../../shared/interfaces/character';
import { CharacterDesign } from '../../../shared/interfaces/design';
declare function character(p: alt.Player, appearance: Partial<CharacterDesign>, info: Partial<CharacterInfo>, name: string): Promise<void>;
declare const _default: {
    character: typeof character;
};
export default _default;
