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
        callbackURL: 'https://acts-tracker.herokuapp.com/auth/github/callback'
    }, (accessToken, refreshToken, profile, cb) => {
        console.log(profile)
        let full_name = profile.displayName.split(' ');
        let first_name = full_name[0];
        let last_name = full_name[full_name.length - 1];
        User.findOneAndUpdate({
            username: profile.username
        }, {
            first_name: first_name|| 'John',
            last_name: last_name || 'Doe',
            username: profile.username
        }, {
            upsert: true,
            new: true
        }, (err, doc) => {
            if (err) {
                console.log(err)
            }
            console.log(doc)
            return cb(null, doc)
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