import * as alt from 'alt-server';
import { getDatabase } from 'simplymongo';
import { Collections } from '../../interface/collections';
const db = getDatabase();
async function saveField(player, fieldName, fieldValue) {
    if (process.env.TEST)
        return;
    alt.setTimeout(async () => await db.updatePartialData(player.data._id, { [fieldName]: fieldValue }, Collections.Characters), 0);
}
async function partial(player, dataObject) {
    if (process.env.TEST)
        return;
    alt.setTimeout(async () => await db.updatePartialData(player.data._id, { ...dataObject }, Collections.Characters), 0);
}
async function onTick(p) {
    p.data.pos = p.pos;
    p.data.armour = p.armour;
    saveField(p, 'pos', p.data.pos);
    saveField(p, 'blood', p.data.blood);
    saveField(p, 'hunger', p.data.hunger);
    saveField(p, 'thirst', p.data.thirst);
    saveField(p, 'mood', p.data.mood);
    saveField(p, 'voice', p.data.voice);
    saveField(p, 'armour', p.data.armour);
}
export default {
    field: saveField,
    partial,
    onTick
};
