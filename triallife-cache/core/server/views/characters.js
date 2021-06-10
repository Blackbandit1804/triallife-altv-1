import * as alt from 'alt-server';
import { View_Events_Characters, View_Events_Creator } from '../../shared/utility/enums';
import { DEFAULT_CONFIG } from '../tlrp/config';
import { playerFuncs } from '../extensions/player';
import * as sm from 'simplymongo';
import './clothing';
import { Collections } from '../interface/collections';
const db = sm.getDatabase();
alt.onClient(View_Events_Characters.Select, handleSelectCharacter);
alt.onClient(View_Events_Characters.Create, handleNewCharacter);
alt.onClient(View_Events_Characters.Delete, handleDelete);
export async function goToCharacterSelect(player) {
    const characters = await db.fetchAllByField('account_id', player.account._id, Collections.Characters);
    player.pendingSelectCharacter = true;
    if (characters.length <= 0) {
        handleNewCharacter(player);
        return;
    }
    for (let i = 0; i < characters.length; i++)
        characters[i]._id = characters[i]._id.toString();
    const pos = { ...DEFAULT_CONFIG.CHARACTER_SELECT_POS };
    player.characters = characters;
    player.rot = { ...DEFAULT_CONFIG.CHARACTER_SELECT_ROT };
    playerFuncs.safe.setPosition(player, pos.x, pos.y, pos.z);
    alt.setTimeout(() => alt.emitClient(player, View_Events_Characters.Show, characters), 1000);
}
export async function handleSelectCharacter(player, id) {
    if (!id)
        return;
    if (!player.characters) {
        alt.logWarning(`[3L:RP] Failed to get characters for a player. Sending them to character select again.`);
        goToCharacterSelect(player);
        return;
    }
    const index = player.characters.findIndex((x) => `${x._id}` === `${id}`);
    if (index <= -1)
        return;
    if (!player.pendingSelectCharacter) {
        alt.log(`${player.name} | Attempted to select a character when not asked to select one.`);
        return;
    }
    player.pendingSelectCharacter = false;
    alt.emitClient(player, View_Events_Characters.Done);
    playerFuncs.select.character(player, player.characters[index]);
}
async function handleDelete(player, id) {
    if (!player.pendingSelectCharacter) {
        alt.log(`${player.name} | Attempted to delete a character when not asked to delete one.`);
        return;
    }
    const character_uid = id;
    await db.deleteById(character_uid, Collections.Characters);
    const characters = await db.fetchAllByField('account_id', player.account._id, Collections.Characters);
    player.pendingSelectCharacter = true;
    if (characters.length <= 0) {
        player.characters = [];
        handleNewCharacter(player);
        return;
    }
    for (let i = 0; i < characters.length; i++)
        characters[i]._id = characters[i]._id.toString();
    const pos = { ...DEFAULT_CONFIG.CHARACTER_SELECT_POS };
    playerFuncs.safe.setPosition(player, pos.x, pos.y, pos.z);
    player.characters = characters;
    alt.emitClient(player, View_Events_Characters.Show, characters);
}
export function handleNewCharacter(player) {
    if (player.characters && player.characters.length >= DEFAULT_CONFIG.PLAYER_MAX_CHARACTER_SLOTS) {
        alt.log(`${player.name} | Attempted to create a new character when max characters was exceeded.`);
        return;
    }
    let totalCharacters = 0;
    if (player.characters)
        totalCharacters = player.characters.length;
    if (!player.pendingSelectCharacter) {
        alt.log(`${player.name} | Attempted to select a character when not asked to select one.`);
        return;
    }
    const pos = { ...DEFAULT_CONFIG.CHARACTER_CREATOR_POS };
    player.pendingSelectCharacter = false;
    player.pendingEditCharacter = true;
    player.pendingCreateCharacter = true;
    player.rot = { ...DEFAULT_CONFIG.CHARACTER_CREATOR_ROT };
    playerFuncs.safe.setPosition(player, pos.x, pos.y, pos.z);
    alt.emitClient(player, View_Events_Characters.Done);
    alt.setTimeout(() => alt.emitClient(player, View_Events_Creator.Show, null, true, false, totalCharacters), 1000);
}
