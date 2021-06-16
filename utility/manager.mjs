import axios from 'axios';

axios
    .get(`http://mg-community.ddns.net:7800/restart/core`)
    .catch((err) => {
        if (!err) return;
        alt.log(`Please run your server first. 'npm run windows' or 'npm run linux'`);
        alt.log(`Ignore this message if your server is already running / working.`);
    })
    .then(() => console.log(`Triggered core server refresh.`));
