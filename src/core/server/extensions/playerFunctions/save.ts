/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import { Database, getDatabase } from 'simplymongo';
import { Character } from '../../../shared/interfaces/character';
import { Collections } from '../../interface/collections';

const db: Database = getDatabase();

async function saveField(player: alt.Player, fieldName: string, fieldValue: any): Promise<void> {
    if (process.env.TEST) return;
    alt.setTimeout(async () => await db.updatePartialData(player.data._id, { [fieldName]: fieldValue }, Collections.Characters), 0);
}

async function partial(player: alt.Player, dataObject: Partial<Character>): Promise<void> {
    if (process.env.TEST) return;
    alt.setTimeout(async () => await db.updatePartialData(player.data._id, { ...dataObject }, Collections.Characters), 0);
}

async function onTick(p: alt.Player): Promise<void> {
    // Update Server Data First
    p.data.pos = p.pos;
    p.data.armour = p.armour;
    // Update Database
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
