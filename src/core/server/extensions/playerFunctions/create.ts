/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import { Character, CharacterDefaults, CharacterInfo } from '../../../shared/interfaces/character';
import { CharacterDesign } from '../../../shared/interfaces/design';
import { Collections } from '../../interface/collections';
import { Database, getDatabase } from 'simplymongo';
import select from './select';

const db: Database = getDatabase();

async function character(p: alt.Player, appearance: Partial<CharacterDesign>, info: Partial<CharacterInfo>, name: string): Promise<void> {
    const newDocument: Partial<Character> = { ...CharacterDefaults };
    newDocument.design = appearance;
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
