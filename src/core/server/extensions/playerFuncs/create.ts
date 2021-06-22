import * as alt from 'alt-server';
import { Character, CharacterDefaults, CharacterInfo } from '../../../shared/interfaces/Character';
import { Database, getDatabase } from 'simplymongo';
import { Design } from '../../../shared/interfaces/design';
import { Collections } from '../../interfaces/collection';
import select from './selection';

const db: Database = getDatabase();

async function character(p: alt.Player, design: Partial<Design>, info: Partial<CharacterInfo>, name: string): Promise<void> {
    const character: Partial<Character> = { ...CharacterDefaults };
    character.design = design;
    character.info = info;
    character.accId = p.account._id;
    character.info.name = name;
    const document = await db.insertData(character, Collections.Characters, true);
    document._id = document._id.toString();
    select.character(p, document);
}

export default { character };
