import * as alt from 'alt-server';
import { ViewEventsCreator } from '../../shared/utility/enums';
import { Design } from '../../shared/interfaces/design';
import { goToCharacterSelect, handleNewCharacter } from './characters';
import * as sm from 'simplymongo';
import { Character, CharacterInfo } from '../../shared/interfaces/Character';
import { playerFuncs } from '../extensions/Player';
import { Collections } from '../utility/enums';

const db: sm.Database = sm.getDatabase();

alt.onClient(ViewEventsCreator.Done, handleCreatorDone);
alt.onClient(ViewEventsCreator.AwaitModel, handleAwaitModel);
alt.onClient(ViewEventsCreator.AwaitName, handleAwaitNameValid);

function handleCreatorDone(player: alt.Player, design: Design, info: CharacterInfo, name: string): void {
    if (!player.pendingCharEdit) {
        alt.log(`${player.name} | Attempted to edit a character when no edit was requested.`);
        return;
    }
    if (!info) {
        player.pendingCharCreate = false;
        player.pendingCharEdit = false;
        if (player.characters && player.characters.length >= 1) {
            goToCharacterSelect(player);
            return;
        }
        alt.log(`${player.name} | Has zero characters. Sending to character editor.`);
        player.pendingCharCreate = false;
        player.pendingCharEdit = false;
        player.pendingCharSelect = true;
        handleNewCharacter(player);
        return;
    }
    if (player.pendingCharCreate) {
        player.pendingCharCreate = false;
        playerFuncs.createNew.character(player, design, info, name);
        return;
    }
    player.pendingCharEdit = false;
    playerFuncs.dataUpdater.updateByKeys(player, design, 'appearance');
    playerFuncs.dataUpdater.updateByKeys(player, info, 'info');
    playerFuncs.sync.design(player);
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
    alt.emitClient(player, ViewEventsCreator.AwaitModel, shouldTPose);
}

async function handleAwaitNameValid(player: alt.Player, name: string): Promise<void> {
    const result = await db.fetchData<Character>('name', name, Collections.Characters);
    if (!result) {
        alt.emitClient(player, ViewEventsCreator.AwaitName, true); // Yes the name is available.
        return;
    }
    alt.emitClient(player, ViewEventsCreator.AwaitName, false); // No the name is not available.
}
