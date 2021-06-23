import * as alt from 'alt-client';

export function isAnyMenuOpen(): boolean {
    if (alt.isConsoleOpen()) return true;
    if (alt.Player.local.isActionMenuOpen) return true;
    if (alt.Player.local.meta.isUnconsciouse) return true;
    if (alt.Player.local.isMenuOpen) return true;
    return false;
}
