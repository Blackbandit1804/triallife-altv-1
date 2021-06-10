import * as alt from 'alt-server';
import { Player } from 'alt-server';
import { Character } from '../../shared/interfaces/Character';
import { ViewEventsCharacters, ViewEventsCreator } from '../../shared/utility/enums';
import { DEFAULT_CONFIG } from '../configs/settings';
import { playerFuncs } from '../extensions/player';
import { Collections } from '../utility/enums';
import * as sm from 'simplymongo';
import './clothing';

const db: sm.Database = sm.getDatabase();

alt.onClient(ViewEventsCharacters.Select, handleSelectCharacter);
alt.onClient(ViewEventsCharacters.New, handleNewCharacter);
alt.onClient(ViewEventsCharacters.Delete, handleDelete);

export async function goToCharacterSelect(player: Player): Promise<void> {
    const characters: Array<Character> = await db.fetchAllByField<Character>('account_id', player.account._id, Collections.Characters);
    player.pendingCharSelect = true;
    if (characters.length <= 0) {
        handleNewCharacter(player);
        return;
    }
    for (let i = 0; i < characters.length; i++) {
        characters[i]._id = characters[i]._id.toString();
    }
    const pos = { ...DEFAULT_CONFIG.CHARACTER_SELECT_POS };
    player.characters = characters;
    player.rot = { ...DEFAULT_CONFIG.CHARACTER_SELECT_ROT } as alt.Vector3;
    playerFuncs.safe.setPosition(player, pos.x, pos.y, pos.z);
    alt.setTimeout(() => {
        alt.emitClient(player, ViewEventsCharacters.Show, characters);
    }, 1000);
}

export async function handleSelectCharacter(player: Player, id: string): Promise<void> {
    if (!id) {
        return;
    }
    if (!player.characters) {
        alt.logWarning(`[Athena] Failed to get characters for a player. Sending them to character select again.`);
        goToCharacterSelect(player);
        return;
    }
    const index = player.characters.findIndex((x) => `${x._id}` === `${id}`);
    if (index <= -1) {
        return;
    }
    if (!player.pendingCharSelect) {
        alt.log(`${player.name} | Attempted to select a character when not asked to select one.`);
        return;
    }
    player.pendingCharSelect = false;
    alt.emitClient(player, ViewEventsCharacters.Done);
    playerFuncs.select.character(player, player.characters[index]);
}

async function handleDelete(player: Player, id: string): Promise<void> {
    if (!player.pendingCharSelect) {
        alt.log(`${player.name} | Attempted to delete a character when not asked to delete one.`);
        return;
    }

    const character_uid = id;
    await db.deleteById(character_uid, Collections.Characters); // Remove Character Here

    // Refetch Characters
    const characters: Array<Character> = await db.fetchAllByField<Character>('account_id', player.account._id, Collections.Characters);

    player.pendingCharSelect = true;

    // No Characters Found
    if (characters.length <= 0) {
        player.characters = [];
        handleNewCharacter(player);
        return;
    }

    // Fixes all character _id to string format.
    for (let i = 0; i < characters.length; i++) {
        characters[i]._id = characters[i]._id.toString();
    }

    const pos = { ...DEFAULT_CONFIG.CHARACTER_SELECT_POS };
    playerFuncs.safe.setPosition(player, pos.x, pos.y, pos.z);

    player.characters = characters;
    alt.emitClient(player, ViewEventsCharacters.Show, characters);
}

export function handleNewCharacter(player: Player): void {
    // Prevent more than 3 characters per account.
    if (player.characters && player.characters.length >= DEFAULT_CONFIG.PLAYER_MAX_CHARACTER_SLOTS) {
        alt.log(`${player.name} | Attempted to create a new character when max characters was exceeded.`);
        return;
    }
    let totalCharacters = 0;
    if (player.characters) {
        totalCharacters = player.characters.length;
    }
    if (!player.pendingCharSelect) {
        alt.log(`${player.name} | Attempted to select a character when not asked to select one.`);
        return;
    }
    const pos = { ...DEFAULT_CONFIG.CHARACTER_CREATOR_POS };
    player.pendingCharSelect = false;
    player.pendingCharEdit = true;
    player.pendingCharCreate = true;

    player.rot = { ...DEFAULT_CONFIG.CHARACTER_CREATOR_ROT } as alt.Vector3;
    playerFuncs.safe.setPosition(player, pos.x, pos.y, pos.z);
    alt.emitClient(player, ViewEventsCharacters.Done);
    alt.setTimeout(() => {
        alt.emitClient(player, ViewEventsCreator.Show, null, true, false, totalCharacters); // _oldCharacterData, _noDiscard, _noName
    }, 1000);
}
