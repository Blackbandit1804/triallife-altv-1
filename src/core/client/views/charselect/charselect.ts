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
let infos: string[];
let open = false;

alt.onServer(ViewEvent.Character_Show, charselectOpen);
alt.onServer(ViewEvent.Character_Done, charselectDone);

async function charselectOpen(_characters: Partial<Character>[], _infos: string[]) {
    characters = _characters;
    infos = _infos;
    view = await View.getInstance(url, true);
    view.on('load', charselectLoad);
    view.on('charselect:Select', charselectSelect);
    view.on('charselect:Create', charselectCreate);
    view.on('charselect:Update', syncDesign);
    view.on('charselect:Equipment', syncEquipment);
    view.on('charselect:Delete', charselectDelete);

    if (open) {
        view.emit('charselect:SetData', characters, infos);
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
    view.emit('charselect:SetData', characters, infos);
}

function charselectDelete(id) {
    alt.emitServer(ViewEvent.Character_Delete, id);
}

function charselectDone() {
    if (!view) {
        open = false;
        return;
    }
    destroyPedEditCamera();
    native.switchInPlayer(1500);
    view.close();
    open = false;
    alt.setTimeout(() => {
        if (native.isScreenFadedOut()) native.doScreenFadeIn(2000);
    }, 1000);
}
