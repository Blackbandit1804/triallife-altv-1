import * as alt from 'alt-server';
import { ViewCreator } from '../../shared/enums/views';
import { Design } from '../../shared/interfaces/design';
import { CharacterInfo } from '../../shared/interfaces/character';
import { goToCharacterSelect, handleNewCharacter } from './characters';
import * as sm from 'simplymongo';
import { Character } from '../../shared/interfaces/Character';
import { playerFuncs } from '../extensions/Player';
import { Collections } from '../interfaces/collections';

const db: sm.Database = sm.getDatabase();

alt.onClient(ViewCreator.Done, handleCreatorDone);
alt.onClient(ViewCreator.AwaitModel, handleAwaitModel);
alt.onClient(ViewCreator.AwaitName, handleAwaitNameValid);

/**
 * Called when a player pushes up Character Creator data.
 * @param  {alt.Player} player
 * @param  {Design} design
 */
function handleCreatorDone(player: alt.Player, design: Design, info: CharacterInfo, name: string): void {
    if (!player.pendingCharacterEdit) {
        alt.log(`${player.name} | Attempted to edit a character when no edit was requested.`);
        return;
    }

    if (!info) {
        player.pendingNewCharacter = false;
        player.pendingCharacterEdit = false;

        if (player.currentCharacters && player.currentCharacters.length >= 1) {
            goToCharacterSelect(player);
            return;
        }

        alt.log(`${player.name} | Has zero characters. Sending to character editor.`);
        player.pendingNewCharacter = false;
        player.pendingCharacterEdit = false;
        player.pendingCharacterSelect = true;
        handleNewCharacter(player);
        return;
    }

    if (player.pendingNewCharacter) {
        player.pendingNewCharacter = false;
        playerFuncs.createNew.character(player, design, info, name);
        return;
    }

    player.pendingCharacterEdit = false;
    playerFuncs.updater.updateByKeys(player, design, 'design');
    playerFuncs.updater.updateByKeys(player, info, 'info');
    playerFuncs.sync.design(player);

    // Resync Position After Appearance for Interior Bug
    alt.setTimeout(() => {
        if (!player || !player.valid) {
            return;
        }

        playerFuncs.safe.setPosition(player, player.pos.x, player.pos.y, player.pos.z);
    }, 500);
}

function handleAwaitModel(player: alt.Player, characterSex: number, shouldTPose: boolean): void {
    player.model = characterSex === 0 ? 'mp_f_freemode_01' : 'mp_m_freemode_01';
    player.pos = player.pos;
    alt.emitClient(player, ViewCreator.AwaitModel, shouldTPose);
}

async function handleAwaitNameValid(player: alt.Player, name: string): Promise<void> {
    const result = await db.fetchData<Character>('name', name, Collections.Characters);

    if (!result) {
        alt.emitClient(player, ViewCreator.AwaitName, true); // Yes the name is available.
        return;
    }

    alt.emitClient(player, ViewCreator.AwaitName, false); // No the name is not available.
}
