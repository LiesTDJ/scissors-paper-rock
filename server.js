'use strict'

import express from 'express';
import path, {dirname} from'path';
import {fileURLToPath} from 'url';

const app = express();
const port = 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get('/', (req, res) => {
    res.sendFile(
        'index.html',
        {
            root: path.join(__dirname, 'public')
        },
        (err) => {
            if (err) {
                console.log('Erreur from the get "/" : ', err);
            }
        }
    );
})

app.get('*', (req, res) => {
    res.sendFile(
        '404-error.jpg',
        {
            root: path.join(__dirname, 'public/img')
        },
        (err) => {
            if (err) {
                console.log('Erreur from the 404 : ', err);
            }
        }
    );
})

app.listen(port, () => {
    console.log('Running on port : ' + port);
})