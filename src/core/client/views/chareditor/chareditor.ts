import * as alt from 'alt-client';
import * as native from 'natives';
import { ViewEvent } from '../../../shared/utility/enums';
import { View } from '../../extensions/view';
import { createPedEditCamera, destroyPedEditCamera, setShouldDisableControls, setFov, setZPos } from '../../utility/camera';
import { Design } from '../../interfaces/design';

const url = `http://resource/client/views/chareditor/html/index.html`;
const fModel = alt.hash('mp_f_freemode_01');
const mModel = alt.hash(`mp_m_freemode_01`);
let view: View;
let oldCharacterData: Partial<Design> | null = {};
let prevData: Partial<Design> | null = {};
let tempData: Partial<Design> | null = {};
let readyInterval: number;
let noDiscard = true;
let noName = true;
let totalCharacters = 0;

native.requestModel(fModel);
native.requestModel(mModel);

alt.onServer(ViewEvent.CharEditor_Sync, syncDesign);
alt.onServer(ViewEvent.CharEditor_Show, chareditorShow);
alt.onServer(ViewEvent.CharEditor_AwaitModel, finishSyncDesign);
alt.onServer(ViewEvent.CharEditor_AwaitName, chareditorFinishName);

async function chareditorShow(_oldCharacterData = null, _noDiscard = true, _noName = true, _totalCharacters = 0) {
    oldCharacterData = _oldCharacterData;
    noDiscard = _noDiscard;
    noName = _noName;
    totalCharacters = _totalCharacters;
    view = await View.getInstance(url, true);
    view.on('chareditor:ReadyDone', chareditorReadyDone);
    view.on('chareditor:Done', chareditorDone);
    view.on('chareditor:Cancel', chareditorCancel);
    view.on('chareditor:Sync', syncDesign);
    view.on('chareditor:CheckName', chareditorCheckName);
    view.on('chareditor:DisableControls', chareditorDisableControls);

    createPedEditCamera({ x: 0.18, y: -0.5, z: 0 });
    setFov(50);
    setZPos(0.6);
    readyInterval = alt.setInterval(checkReady, 100);
}

function chareditorClose() {
    if (!view) return;
    native.doScreenFadeOut(100);
    oldCharacterData = null;
    destroyPedEditCamera();
    view.close();
}

async function chareditorDone(newData, infoData, name: string) {
    await chareditorClose();
    alt.emitServer(ViewEvent.CharEditor_Done, newData, infoData, name);
}

async function chareditorCancel() {
    chareditorClose();
    alt.emitServer(ViewEvent.CharEditor_Done, oldCharacterData);
}

function checkReady() {
    if (!view) return;
    view.emit('chareditor:Ready', noDiscard, noName);
}

function chareditorReadyDone() {
    if (readyInterval !== undefined || readyInterval !== null) {
        alt.clearInterval(readyInterval);
        readyInterval = null;
    }
    view.emit('chareditor:SetData', oldCharacterData, totalCharacters);
}

function chareditorCheckName(name: string): void {
    alt.emitServer(ViewEvent.CharEditor_AwaitName, name);
}

function chareditorFinishName(result: boolean): void {
    view.emit('chareditor:IsNameAvailable', result);
}

function chareditorDisableControls(shouldDisableControls: boolean): void {
    setShouldDisableControls(shouldDisableControls);
}

export async function syncDesign(data: Partial<Design>): Promise<void> {
    tempData = data;
    alt.Player.local.meta.design = data as Design;
    native.clearPedBloodDamage(alt.Player.local.scriptID);
    native.clearPedDecorations(alt.Player.local.scriptID);
    native.setPedHeadBlendData(alt.Player.local.scriptID, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);
    const modelNeeded = data.sex === 0 ? fModel : mModel;
    if (modelNeeded !== alt.Player.local.model) alt.emitServer(ViewEvent.CharEditor_AwaitModel, data.sex);
    else finishSyncDesign();
}

async function finishSyncDesign() {
    native.setPedHeadBlendData(alt.Player.local.scriptID, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);
    native.setPedHeadBlendData(
        alt.Player.local.scriptID,
        tempData.faceMother,
        tempData.faceFather,
        0,
        tempData.skinMother,
        tempData.skinFather,
        0,
        parseFloat(tempData.faceMix.toString()),
        parseFloat(tempData.skinMix.toString()),
        0,
        false
    );

    for (let i = 0; i < tempData.structure.length; i++) {
        const value = tempData.structure[i];
        native.setPedFaceFeature(alt.Player.local.scriptID, i, value);
    }

    for (let i = 0; i < tempData.opacityOverlays.length; i++) {
        const overlay = tempData.opacityOverlays[i];
        native.setPedHeadOverlay(alt.Player.local.scriptID, overlay.id, overlay.value, parseFloat(overlay.opacity.toString()));
    }

    const collection = native.getHashKey(tempData.hairOverlay.collection);
    const overlay = native.getHashKey(tempData.hairOverlay.overlay);
    native.addPedDecorationFromHashes(alt.Player.local.scriptID, collection, overlay);
    native.setPedComponentVariation(alt.Player.local.scriptID, 2, tempData.hair, 0, 0);
    native.setPedHairColor(alt.Player.local.scriptID, tempData.hairColor1, tempData.hairColor2);

    native.setPedHeadOverlay(alt.Player.local.scriptID, 1, tempData.facialHair, tempData.facialHairOpacity);
    native.setPedHeadOverlayColor(alt.Player.local.scriptID, 1, 1, tempData.facialHairColor1, tempData.facialHairColor1);

    native.setPedHeadOverlay(alt.Player.local.scriptID, 2, tempData.eyebrows, 1);
    native.setPedHeadOverlayColor(alt.Player.local.scriptID, 2, 1, tempData.eyebrowsColor1, tempData.eyebrowsColor1);

    for (let i = 0; i < tempData.colorOverlays.length; i++) {
        const overlay = tempData.colorOverlays[i];
        const color2 = overlay.color2 ? overlay.color2 : overlay.color1;
        native.setPedHeadOverlay(alt.Player.local.scriptID, overlay.id, overlay.value, parseFloat(overlay.opacity.toString()));
        native.setPedHeadOverlayColor(alt.Player.local.scriptID, overlay.id, 1, overlay.color1, color2);
    }

    native.setPedEyeColor(alt.Player.local.scriptID, tempData.eyes);
    native.clearAllPedProps(alt.Player.local.scriptID);

    if (tempData.sex === 0) {
        native.setPedComponentVariation(alt.Player.local.scriptID, 1, 0, 0, 0); // mask
        native.setPedComponentVariation(alt.Player.local.scriptID, 3, 15, 0, 0); // arms
        native.setPedComponentVariation(alt.Player.local.scriptID, 4, 14, 0, 0); // pants
        native.setPedComponentVariation(alt.Player.local.scriptID, 5, 0, 0, 0); // bag
        native.setPedComponentVariation(alt.Player.local.scriptID, 6, 35, 0, 0); // shoes
        native.setPedComponentVariation(alt.Player.local.scriptID, 7, 0, 0, 0); // accessories
        native.setPedComponentVariation(alt.Player.local.scriptID, 8, 15, 0, 0); // undershirt
        native.setPedComponentVariation(alt.Player.local.scriptID, 9, 0, 0, 0); // body armour
        native.setPedComponentVariation(alt.Player.local.scriptID, 11, 15, 0, 0); // torso
    } else {
        native.setPedComponentVariation(alt.Player.local.scriptID, 1, 0, 0, 0); // mask
        native.setPedComponentVariation(alt.Player.local.scriptID, 3, 15, 0, 0); // arms
        native.setPedComponentVariation(alt.Player.local.scriptID, 5, 0, 0, 0); // bag
        native.setPedComponentVariation(alt.Player.local.scriptID, 4, 14, 0, 0); // pants
        native.setPedComponentVariation(alt.Player.local.scriptID, 6, 34, 0, 0); // shoes
        native.setPedComponentVariation(alt.Player.local.scriptID, 7, 0, 0, 0); // accessories
        native.setPedComponentVariation(alt.Player.local.scriptID, 8, 15, 0, 0); // undershirt
        native.setPedComponentVariation(alt.Player.local.scriptID, 9, 0, 0, 0); // body armour
        native.setPedComponentVariation(alt.Player.local.scriptID, 11, 91, 0, 0); // torso
    }
    if (native.isScreenFadedOut()) native.doScreenFadeIn(500);
    native.setEntityCoordsNoOffset(alt.Player.local.scriptID, alt.Player.local.pos.x, alt.Player.local.pos.y, alt.Player.local.pos.z, false, false, false);
    prevData = tempData;
}
