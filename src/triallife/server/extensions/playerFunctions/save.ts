import * as alt from 'alt-server';
import { Database, getDatabase } from 'simplymongo';
import { Character } from '../../../shared/interfaces/character';
import { Collections } from '../../interfaces/collections';

const db: Database = getDatabase();

async function saveField(p: alt.Player, fieldName: string, fieldValue: any): Promise<void> {
    if (process.env.TEST) {
        return;
    }

    alt.setTimeout(async () => {
        await db.updatePartialData(p.data._id, { [fieldName]: fieldValue }, Collections.Characters);
    }, 0);
}

async function partial(p: alt.Player, dataObject: Partial<Character>): Promise<void> {
    if (process.env.TEST) {
        return;
    }

    alt.setTimeout(async () => {
        await db.updatePartialData(p.data._id, { ...dataObject }, Collections.Characters);
    }, 0);
}

async function onTick(p: alt.Player): Promise<void> {
    // Update Server Data First
    p.data.pos = p.pos;
    p.data.blood = p.health;
    p.data.armour = p.armour;

    // Update Database
    saveField(p, 'pos', p.data.pos);
    saveField(p, 'health', p.data.blood);
    saveField(p, 'armour', p.data.armour);
}

export default {
    field: saveField,
    partial,
    onTick
};
