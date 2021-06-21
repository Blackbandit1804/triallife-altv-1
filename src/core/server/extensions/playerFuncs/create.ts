import * as alt from 'alt-server';
import { Character, CharacterDefaults, CharacterInfo } from '../../../shared/interfaces/Character';
import { Database, getDatabase } from 'simplymongo';
import { Design } from '../../../shared/interfaces/design';
import { Collections } from '../../interfaces/collection';
import select from './selection';

const db: Database = getDatabase();

async function character(p: alt.Player, design: Partial<Design>, info: Partial<CharacterInfo>, name: string): Promise<void> {
    const newDocument: Partial<Character> = { ...CharacterDefaults };
    newDocument.design = design;
    newDocument.info = info;
    newDocument.account_id = p.account._id;
    newDocument.info.name = name;
    const document = await db.insertData(newDocument, Collections.Characters, true);
    document._id = document._id.toString();
    select.character(p, document);
}

export default { character };
