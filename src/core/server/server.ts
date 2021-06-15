import * as alt from 'alt-server';
import * as sm from 'simplymongo';
import express from 'express';
import { DefaultConfig } from './configs/settings';
import { Collections } from './interface/collections';
import Logger from './utility/tlrp-logger';

const app = express();
const port = 7800;

app.get('/v1/get/key', async (req, res) => {
    res.send({ status: true, key: '7ab7ab93f799702223b12852b377887215fce530a7cf4a6e7c857958377f2f15' });
});
