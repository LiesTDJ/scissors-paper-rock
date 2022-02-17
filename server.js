'use strict'

import express from 'express';
import path, {dirname} from'path';
import {fileURLToPath} from 'url';

import expressSession from 'express-session';
import sessionFileStore from 'session-file-store';
import { v4 as uuidv4 } from 'uuid';
import bodyParser from 'body-parser';

import pug from 'pug';

const app = express();
const port = 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

app.use('/js', express.static(path.join(__dirname, 'public/js')));

app.use('/css', express.static(path.join(__dirname, 'public/css')));

app.use('/img', express.static(path.join(__dirname, 'public/img')));

app.set('view engine', 'pug');

const ExpressSessionFileStore = sessionFileStore(expressSession);
const fileStore = new ExpressSessionFileStore({
    path: './sessions',
    ttl: 3600,
    retries: 10,
    secret: 'Mon super secret!'
});

app.use(expressSession({
    store: fileStore,
    secret: 'mon secret de session',
    resave: false,
    saveUninitialized: false,
}));

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

app.route('/loginSession')
    .post((req, res) => {
        req.session[req.body?.name] = {
            id: uuidv4(),
            name: req.body?.name,
            email: req.body?.email
        };

        res.render(
            'confirmationSession',
            {
                name: req.body?.name,
                email: req.body?.email,
            }
        );
    })

app.route('/gameField')
    .post((req, res) => {
        req.session[req.body?.name] = {
            name: req.body?.name,
            email: req.body?.email
        };

        res.render(
            'gameField',
            {
                name: req.body?.name,
                email: req.body?.email,
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