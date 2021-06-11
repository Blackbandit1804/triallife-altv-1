import * as alt from 'alt-server';
import express from 'express';

const app = express();
const port = 7800;

app.get('restart/:resourceName', async (req, res) => {
    if (!alt.hasResource(req.params.resourceName)) {
        alt.logWarning(`${req.params.resourceName.toUpperCase()} is not a resource`);
        return;
    }
    alt.restartResource(req.params.resourceName);
});

alt.on('enable:Entry', () => {
    alt.Player.all.map((player) => {
        const data = player.getMeta('tlrp:discord:info');
        if (!data) {
            player.kick('Trial Life resource has been restarted.');
            return;
        }
        alt.emit('discord:Login', player, data);
    });
});

app.listen(port);
