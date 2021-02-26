const passport = require('passport');
const LocalStrategy = require('passport-local');
const GitHubStrategy = require('passport-github').Strategy;
const bcrypt = require('bcrypt');
const User = require('./user.model');

module.exports = (app) => {
    passport.serializeUser((user, done) => {
        done(null, user._id)
    });
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, doc) => {
            done(null, doc)
        })
    });
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/github/callback'
    }, (accessToken, refreshToken, profile, cb) => {
        User.findOneAndUpdate({
            id: profile.id
        }, {
            $setOnInsert: {
                id: profile.id,
                name: profile.displayName || 'John Doe',
                photo: profile.photos[0].value || '',
                email: Array.isArray(profile.emails)
                    ? profile.emails[0].value
                    : 'No public email',
                created_on: new Date(),
                provider: profile.provider || ''
            }, $set: {
                last_login: new Date()
            }, $inc: {
                login_count: 1
            }
        }, {
            upsert: true,
            new: true
        }, (err, doc) => {
            return cb(null, doc.value)
        })
    }));
    passport.use(new LocalStrategy(
        (username, password, done) => {
            User.findOne({
                username: username
            }, (err, user) => {
                if (err) {
                    return done(err)
                }
                if (!user) {
                    return done(null, false)
                }
                if (!bcrypt.compareSync(password, user.password)) {
                    return done(null, false);
                }
                return done(null, user);
            })
        }
    ))
}