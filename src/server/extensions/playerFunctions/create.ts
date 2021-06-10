import * as alt from 'alt-server';
import { Character, CharacterDefaults, CharacterInfo } from '../../../shared/interfaces/Character';
import { Database, getDatabase } from 'simplymongo';
import { Design } from '../../../shared/interfaces/design';
import select from './select';
import { Vehicle } from '../../../shared/interfaces/vehicle';
import { Collections } from '../../utility/enums';

const db: Database = getDatabase();

async function character(p: alt.Player, design: Partial<Design>, info: Partial<CharacterInfo>, name: string): Promise<void> {
    const newDocument: Partial<Character> = { ...CharacterDefaults };
    newDocument.design = design;
    newDocument.info = info;
    newDocument.account_id = p.account._id;
    newDocument.name = name;
    const document = await db.insertData(newDocument, Collections.Characters, true);
    document._id = document._id.toString(); // Re-cast id object as string.
    select.character(p, document);
}

export default {
    character
};
