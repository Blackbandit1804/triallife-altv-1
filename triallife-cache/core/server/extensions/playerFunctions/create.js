import { CharacterDefaults } from '../../../shared/interfaces/character';
import { Collections } from '../../interface/collections';
import { getDatabase } from 'simplymongo';
import select from './select';
const db = getDatabase();
async function character(p, appearance, info, name) {
    const newDocument = { ...CharacterDefaults };
    newDocument.design = appearance;
    newDocument.info = info;
    newDocument.account_id = p.account._id;
    newDocument.name = name;
    const document = await db.insertData(newDocument, Collections.Characters, true);
    document._id = document._id.toString();
    select.character(p, document);
}
export default {
    character
};
