import * as alt from 'alt-client';
import * as native from 'natives';
import { ViewEvent } from '../../../shared/utility/enums';
import { Character } from '../../../shared/interfaces/character';
import { View } from '../../extensions/view';
import { createPedEditCamera, destroyPedEditCamera, setFov, setZPos } from '../../utility/camera';
import { syncEquipment } from '../clothing/clothing';
import { syncDesign } from '../chareditor/chareditor';

const url = `http://resource/client/views/charselect/html/index.html`;
let view: View;
let characters: Partial<Character>[];
let open = false;

alt.onServer(ViewEvent.Character_Show, charscelectOpen);
alt.onServer(ViewEvent.Character_Done, charscelectDone);

async function charscelectOpen(_characters: Partial<Character>[]) {
    characters = _characters;
    view = await View.getInstance(url, true);
    view.on('charselect:load', charselectLoad);
    view.on('charselect:Select', charselectSelect);
    view.on('charselect:Create', charselectCreate);
    view.on('charselect:Update', syncDesign);
    view.on('charselect:Equipment', syncEquipment);
    view.on('charselect:Delete', charselectDelete);

    if (open) {
        view.emit('charselect:Set', characters);
        return;
    }
    open = true;
    createPedEditCamera();
    setFov(80);
    setZPos(0.2);
}

async function charselectSelect(id) {
    native.doScreenFadeOut(100);
    alt.emitServer(ViewEvent.Character_Select, id);
}

function charselectCreate() {
    alt.emitServer(ViewEvent.Character_Create);
}

function charselectLoad() {
    if (!view) return;
    view.emit('charselect:Set', characters);
}

function charselectDelete(id) {
    alt.emitServer(ViewEvent.Character_Delete, id);
}

function charscelectDone() {
    if (!view) {
        open = false;
        return;
    }
    destroyPedEditCamera();
    native.switchInPlayer(1500);
    view.close();
    open = false;
}
