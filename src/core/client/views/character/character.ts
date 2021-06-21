import * as alt from 'alt-client';
import * as native from 'natives';
import { ViewEvent } from '../../../shared/utility/enums';
import { Character } from '../../../shared/interfaces/character';
import { View } from '../../extensions/view';
import { createPedEditCamera, destroyPedEditCamera, setFov, setZPos } from '../../utility/camera';
//import { handleEquipment } from '../clothing/clothing';
//import { handleSync } from '../creator/creator';

const url = `http://resource/client/views/character/html/index.html`;
let view: View;
let characters: Partial<Character>[];
let open = false;

alt.onServer(ViewEvent.Character_Show, handleView);
alt.onServer(ViewEvent.Character_Done, handleDone);

async function handleView(_characters: Partial<Character>[]) {
    characters = _characters;
    view = await View.getInstance(url, true);
    view.on('load', handleLoad);
    view.on('characters:Select', handleSelect);
    view.on('characters:New', handleNew);
    //view.on('characters:Update', handleSync);
    //view.on('characters:Equipment', handleEquipment);
    view.on('characters:Delete', handleDelete);

    if (open) {
        view.emit('characters:Set', characters);
        return;
    }
    open = true;
    createPedEditCamera();
    setFov(80);
    setZPos(0.2);
}

async function handleSelect(id) {
    native.doScreenFadeOut(100);
    alt.emitServer(ViewEvent.Character_Select, id);
}

function handleNew() {
    alt.emitServer(ViewEvent.Character_Create);
}

function handleLoad() {
    if (!view) return;
    view.emit('characters:Set', characters);
}

function handleDelete(id) {
    alt.emitServer(ViewEvent.Character_Delete, id);
}
function handleDone() {
    if (!view) {
        open = false;
        return;
    }
    destroyPedEditCamera();
    native.switchInPlayer(1500);
    view.close();
    open = false;
}
