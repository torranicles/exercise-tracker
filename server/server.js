'use strict';
require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const connection = require('./connection');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const auth = require('./auth');
const app = express();

app.use(cors());
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
connection.db.once('open', () => {
    console.log('connected')
    auth(app)
    routes(app)
})
app.listen(5000, () => {
    console.log("Listening to port " + 5000);
})