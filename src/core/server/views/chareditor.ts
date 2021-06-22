import * as alt from 'alt-server';
import * as sm from 'simplymongo';
import { ViewEvent } from '../../shared/utility/enums';
import { Design } from '../../client/interfaces/design';
import { Character, CharacterInfo } from '../../shared/interfaces/character';
import { openCharSelect, handleCreateCharacter } from './charselect';
import { playerFuncs } from '../extensions/player';
import { Collections } from '../interfaces/collection';
import Logger from '../utility/Logger';

const db: sm.Database = sm.getDatabase();

alt.onClient(ViewEvent.CharEditor_Done, handleCreatorDone);
alt.onClient(ViewEvent.CharEditor_AwaitModel, handleAwaitModel);
alt.onClient(ViewEvent.CharEditor_AwaitName, handleAwaitNameValid);

function handleCreatorDone(player: alt.Player, design: Design, info: CharacterInfo, name: string): void {
    if (!player.pendingCharEdit) {
        Logger.log(`${player.name} | Attempted to edit a character when no edit was requested.`);
        return;
    }
    if (!info) {
        player.pendingCharCreate = false;
        player.pendingCharEdit = false;
        if (player.characters && player.characters.length >= 1) {
            openCharSelect(player);
            return;
        }
        Logger.log(`${player.name} | Has zero characters. Sending to character editor.`);
        player.pendingCharCreate = false;
        player.pendingCharEdit = false;
        player.pendingCharSelect = true;
        handleCreateCharacter(player);
        return;
    }
    if (player.pendingCharCreate) {
        player.pendingCharCreate = false;
        playerFuncs.create.character(player, design, info, name);
        return;
    }
    player.pendingCharEdit = false;
    playerFuncs.updater.updateByKeys(player, design, 'design');
    playerFuncs.updater.updateByKeys(player, info, 'info');
    playerFuncs.sync.design(player);
    alt.setTimeout(() => {
        if (!player || !player.valid) return;
        playerFuncs.save.setPosition(player, player.pos.x, player.pos.y, player.pos.z);
    }, 500);
}

function handleAwaitModel(player: alt.Player, characterSex: number, shouldTPose: boolean): void {
    player.model = characterSex === 0 ? 'mp_f_freemode_01' : 'mp_m_freemode_01';
    player.pos = player.pos;
    alt.emitClient(player, ViewEvent.CharEditor_AwaitModel, shouldTPose);
}

async function handleAwaitNameValid(player: alt.Player, name: string): Promise<void> {
    const result = await db.fetchData<Character>('name', name, Collections.Characters);
    if (!result) {
        alt.emitClient(player, ViewEvent.CharEditor_AwaitName, true);
        return;
    }
    alt.emitClient(player, ViewEvent.CharEditor_AwaitName, false);
}
