/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import { Character, CharacterDefaults } from '../../../shared/interfaces/character';

function init(player: alt.Player, data: Character = null) {
    player.data = Object.assign({}, CharacterDefaults);
    if (data) Object.keys(data).forEach((key) => (player.data[key] = data[key]));
}

function updateByKeys(player: alt.Player, dataObject: { [key: string]: any }, targetDataName: string = '') {
    Object.keys(dataObject).forEach((key) => {
        if (targetDataName !== '') player.data[targetDataName][key] = dataObject[key];
        else player.data[key] = dataObject[key];
    });
}

export default {
    init,
    updateByKeys
};
