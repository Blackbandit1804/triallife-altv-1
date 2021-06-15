import * as alt from 'alt-client';

export function isAnyMenuOpen(): boolean {
    if (alt.Player.local.isChatOpen) {
        return true;
    }

    if (alt.Player.local.isActionMenuOpen) {
        return true;
    }

    if (alt.Player.local.meta.isDead) {
        return true;
    }

    if (alt.Player.local.isMenuOpen) {
        return true;
    }

    if (alt.Player.local.isLeaderboardOpen) {
        return true;
    }

    return false;
}
