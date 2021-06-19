import * as alt from 'alt-client';

export function sleep(duration: number): Promise<void> {
    return new Promise((resolve) => {
        let timeout = alt.setTimeout(() => {
            alt.clearTimeout(timeout);
            return resolve();
        }, duration);
    });
}
