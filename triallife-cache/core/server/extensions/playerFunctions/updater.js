import { CharacterDefaults } from '../../../shared/interfaces/character';
function init(player, data = null) {
    player.data = Object.assign({}, CharacterDefaults);
    if (data)
        Object.keys(data).forEach((key) => (player.data[key] = data[key]));
}
function updateByKeys(player, dataObject, targetDataName = '') {
    Object.keys(dataObject).forEach((key) => {
        if (targetDataName !== '')
            player.data[targetDataName][key] = dataObject[key];
        else
            player.data[key] = dataObject[key];
    });
}
export default {
    init,
    updateByKeys
};
