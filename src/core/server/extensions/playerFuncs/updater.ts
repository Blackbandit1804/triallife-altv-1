import * as alt from 'alt-server';
import { Character, CharacterDefaults } from '../../../shared/interfaces/character';

function init(p: alt.Player, data: Character = null) {
    p.data = Object.assign({}, CharacterDefaults);
    if (data) Object.keys(data).forEach((key) => (p.data[key] = data[key]));
}

function updateByKeys(p: alt.Player, dataObject: { [key: string]: any }, targetDataName: string = '') {
    Object.keys(dataObject).forEach((key) => {
        if (targetDataName !== '') p.data[targetDataName][key] = dataObject[key];
        else p.data[key] = dataObject[key];
    });
}

export default { init, updateByKeys };
