import * as alt from 'alt-server';
import { Player } from 'alt-server';
import { Character } from '../../shared/interfaces/character';
import { SystemEvent, ViewEvent } from '../../shared/utility/enums';
import { DefaultConfig } from '../configs/settings';
import { playerFuncs } from '../extensions/player';
import * as sm from 'simplymongo';
import './clothing';
import { Collections } from '../interfaces/collection';
import Logger from '../utility/Logger';
import changelogs from '../configs/changelog.json';

const db: sm.Database = sm.getDatabase();

alt.onClient(ViewEvent.Character_Select, handleSelectCharacter);
alt.onClient(ViewEvent.Character_Create, handleCreateCharacter);
alt.onClient(ViewEvent.Character_Delete, handleDeleteCharacter);

export async function openCharSelect(player: Player): Promise<void> {
    alt.emit(SystemEvent.Voice_Remove, player);
    const characters: Array<Character> = await db.fetchAllByField<Character>('accId', player.account._id, Collections.Characters);
    player.pendingCharSelect = true;
    if (characters.length === 0) {
        handleCreateCharacter(player);
        return;
    }
    for (let i = 0; i < characters.length; i++) characters[i]._id = characters[i]._id.toString();
    const pos = { ...DefaultConfig.CHARACTER_SELECT_POS };
    player.characters = characters;
    player.rot = { ...DefaultConfig.CHARACTER_SELECT_ROT } as alt.Vector3;
    playerFuncs.save.setPosition(player, pos.x, pos.y, pos.z);
    alt.setTimeout(() => alt.emitClient(player, ViewEvent.Character_Show, characters, changelogs), 1000);
}

export async function handleSelectCharacter(player: Player, id: string): Promise<void> {
    if (!id) return;
    if (!player.characters) {
        Logger.warning(`Failed to get characters for a player. Sending them to character select again.`);
        openCharSelect(player);
        return;
    }
    const index = player.characters.findIndex((x) => `${x._id}` === `${id}`);
    if (index === -1) return;
    if (!player.pendingCharSelect) {
        Logger.log(`${player.name} | Attempted to select a character when not asked to select one.`);
        return;
    }
    player.pendingCharSelect = false;
    alt.emitClient(player, ViewEvent.Character_Done);
    playerFuncs.select.character(player, player.characters[index]);
}

export function handleCreateCharacter(player: Player): void {
    if (player.characters && player.characters.length >= DefaultConfig.PLAYER_MAX_CHARACTER_SLOTS) {
        Logger.log(`${player.name} | Attempted to create a new character when max characters was exceeded.`);
        return;
    }
    let totalCharacters = 0;
    if (player.characters) totalCharacters = player.characters.length;
    if (!player.pendingCharSelect) {
        Logger.log(`${player.name} | Attempted to select a character when not asked to select one.`);
        return;
    }
    const pos = { ...DefaultConfig.CHARACTER_CREATOR_POS };
    player.pendingCharSelect = false;
    player.pendingCharEdit = true;
    player.pendingCharCreate = true;
    player.rot = { ...DefaultConfig.CHARACTER_CREATOR_ROT } as alt.Vector3;
    playerFuncs.save.setPosition(player, pos.x, pos.y, pos.z);
    alt.emitClient(player, ViewEvent.Character_Done);
    alt.setTimeout(() => alt.emitClient(player, ViewEvent.CharEditor_Show, null, true, false, totalCharacters), 1000);
}

async function handleDeleteCharacter(player: Player, id: string): Promise<void> {
    if (!player.pendingCharSelect) {
        alt.log(`${player.name} | Attempted to delete a character when not asked to delete one.`);
        return;
    }
    const character_uid = id;
    await db.deleteById(character_uid, Collections.Characters);
    const characters: Array<Character> = await db.fetchAllByField<Character>('accId', player.account._id, Collections.Characters);
    player.pendingCharSelect = true;
    if (characters.length == 0) {
        player.characters = [];
        handleCreateCharacter(player);
        return;
    }
    for (let i = 0; i < characters.length; i++) characters[i]._id = characters[i]._id.toString();
    const pos = { ...DefaultConfig.CHARACTER_SELECT_POS };
    playerFuncs.save.setPosition(player, pos.x, pos.y, pos.z);
    player.characters = characters;
    alt.emitClient(player, ViewEvent.Character_Show, characters, changelogs);
}
