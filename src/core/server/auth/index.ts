import Logger from '../utility/tlrp-logger';
import { getDiscordOAuth2URL } from '../views/login';

const express = require('express');
const app = express();

app.get('/', (req, res) => res.redirect(getDiscordOAuth2URL()));

app.listen(7800, () => Logger.log('auth service listen on port 7800'));
