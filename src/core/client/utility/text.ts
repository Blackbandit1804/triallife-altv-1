import * as alt from 'alt-client';
import * as native from 'natives';

const temporaryText = [];
let tempInterval;

export function drawText2D(text: string, pos: alt.IVector2, scale: number, color: alt.RGBA) {
    if (scale > 2) scale = 2;
    native.beginTextCommandDisplayText('STRING');
    native.addTextComponentSubstringPlayerName(text);
    native.setTextFont(4);
    native.setTextScale(1, scale);
    native.setTextWrap(0.0, 1.0);
    native.setTextCentre(true);
    native.setTextColour(color.r, color.g, color.b, color.a);
    native.setTextOutline();
    native.setTextDropShadow();
    native.endTextCommandDisplayText(pos.x, pos.y, 0);
}

export function drawRectangle(pos: alt.IVector3, width: alt.IVector2, color: alt.RGBA) {
    const [isOnScreen, x, y] = native.getScreenCoordFromWorldCoord(pos.x, pos.y, pos.z, 0, 0);
    if (!isOnScreen) return;
    native.setDrawOrigin(pos.x, pos.y, pos.z, 0);
    native.drawRect(0, 0, width.x, width.y, color.r, color.g, color.b, color.a, false);
    native.clearDrawOrigin();
}

export function drawText3D(text: string, pos: alt.IVector3, scale: number, color: alt.RGBA) {
    if (scale > 2) scale = 2;
    native.setDrawOrigin(pos.x, pos.y, pos.z, 0); // Used to stabalize text, sprites, etc. in a 3D Space.
    native.beginTextCommandDisplayText('STRING');
    native.addTextComponentSubstringPlayerName(text);
    native.setTextFont(4);
    native.setTextScale(1, scale);
    native.setTextWrap(0.0, 1.0);
    native.setTextCentre(true);
    native.setTextColour(color.r, color.g, color.b, color.a);
    native.setTextOutline();
    native.setTextDropShadow();
    native.endTextCommandDisplayText(0, 0, 0);
    native.clearDrawOrigin();
}

export function addTemporaryText(identifier, msg, x, y, scale, r, g, b, a, ms) {
    const index = temporaryText.findIndex((data) => data.identifier === identifier);
    if (index !== -1) {
        try {
            alt.clearTimeout(temporaryText[index].timeout);
        } catch (err) {}
        temporaryText.splice(index, 1);
    }
    const timeout = alt.setTimeout(() => removeText(identifier), ms);
    temporaryText.push({ identifier, msg, x, y, scale, r, g, b, a, timeout });
    if (tempInterval) {
        alt.clearInterval(tempInterval);
        tempInterval = null;
    }
    tempInterval = alt.setInterval(handleDrawTemporaryText, 0);
}

function removeText(identifier: string): void {
    const index = temporaryText.findIndex((data) => data.identifier === identifier);
    if (index <= -1) return;
    temporaryText.splice(index, 1);
    if (temporaryText.length <= 0) {
        alt.clearInterval(tempInterval);
        tempInterval = null;
    }
}

function handleDrawTemporaryText(): void {
    for (let i = 0; i < temporaryText.length; i++) {
        const data = temporaryText[i];
        drawText2D(data.msg, { x: data.x, y: data.y }, data.scale, new alt.RGBA(data.r, data.g, data.b, data.a));
    }
}
