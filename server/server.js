'use strict';
require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const connection = require('./connection');
const session = require('express-session');
const routes = require('./routes');
const auth = require('./auth');
const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false
    },
    key: 'express.sid'
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.resolve(__dirname + '/.././build')));

connection.db.once('open', () => {
    console.log('connected')
    auth(app)
    routes(app)
    app.get('/*', (req, res) => {
        res.sendFile(path.resolve(__dirname + '/.././build/index.html'));
    });
})
app.listen(process.env.PORT, () => {
    console.log("Listening to port " + process.env.PORT);
})