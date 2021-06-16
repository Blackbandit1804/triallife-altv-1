import * as alt from 'alt-server';
import express from 'express';
import { default as logger, default as Logger } from '../core/server/utility/tlrp-logger';

const app = express();
const port = 7800;

app.get('/restart/:resourceName', async (req, res) => {
    if (!alt.hasResource(req.params.resourceName)) {
        logger.warning(`${req.params.resourceName} is not a resource.`);
        return;
    }
    alt.restartResource(req.params.resourceName);
});

alt.on('enable:Entry', () => {
    alt.Player.all.map((player) => {
        const data = player.getMeta('tlrp:discord:info');
        if (!data) {
            player.kick('Core resource has been restarted.');
            return;
        }
        alt.emit('Discord:Login', player, data);
    });
});

app.listen(port, () => logger.info(`express service running on port ${port}`));
