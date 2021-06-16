import * as alt from 'alt-server';
import { Character, CharacterDefaults, CharacterInfo } from '../../../shared/interfaces/character';
import { Database, getDatabase } from 'simplymongo';
import { Appearance } from '../../../shared/interfaces/design';
import select from './select';
import { Collections } from '../../interface/collections';

const db: Database = getDatabase();

async function character(p: alt.Player, appearance: Partial<Appearance>, info: Partial<CharacterInfo>, name: string): Promise<void> {
    const newDocument: Partial<Character> = { ...CharacterDefaults };
    newDocument.appearance = appearance;
    newDocument.info = info;
    newDocument.account_id = p.accountData._id;
    newDocument.name = name;
    const document = await db.insertData(newDocument, Collections.Characters, true);
    document._id = document._id.toString(); // Re-cast id object as string.
    select.character(p, document);
}

export default {
    character
};
