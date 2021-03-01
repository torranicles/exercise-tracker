const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('./user.model');
const Exercise = require('./exercise.model');

module.exports = (app) => {
    const ensureAuthenticated = (req, res, next) => {
        if (req.isAuthenticated()) {
            console.log('authenticated')
            return next()
        }
        console.log('not authenticated')
        res.send({
            logged_in: false
        })
    }

    app.route('/auth/github')
        .get(passport.authenticate('github'));

    app.route('/auth/github/callback')
        .get(passport.authenticate('github', {
            successRedirect: '/dashboard'
        })
    )
    
    app.get('/logged_in', ensureAuthenticated, (req, res) => {
        res.send({
            logged_in: true
        })
    })

    app.post('/api/register', (req, res, next) => {
        let {first_name, last_name, username, password} = req.body;
        User.findOne({
            username: username
        }, (err, user) => {
            if (err) {
                console.log(err);
                throw new Error('An error occured. Please try again.')
            } else if (user) {
                return res.send(['Username already taken.'])
            } else {
                const hash = bcrypt.hashSync(password, 12);
                new User({
                    first_name: first_name,
                    last_name: last_name,
                    username: username,
                    password: password.length >= 6 
                        ? hash
                        : password // will throw an error under validation/will not be saved
                })
                .save((err, doc) => {
                    if (err) {
                        if (err.name == 'ValidationError') {
                            console.log(Object.values(err.errors).map(val => val.message))
                            return res.send(Object.values(err.errors).map(val => val.message))
                        }
                        return res.status(500)
                                .send({
                                    message: "An error occured, please try again"
                                })
                    } else {
                        next(null, doc)
                    }
                });
            }
        })
    }, passport.authenticate('local'), (req, res) => {
        res.send({
            username: req.user.username, 
            logged_in: true
        })
    });

    app.post('/api/login', (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) { 
                console.log(err)
                return next(err); 
            }
            if (!user) { 
                return res.send("Invalid username or password"); 
            } else {
                req.login(user, (err) => {
                    if (err) {
                        return next(err);
                    }
                    return res.send({
                        username: req.user.username, 
                        logged_in: true
                    })
                })
            }
        }) (req,res,next);
    })
        

    app.get('/logout', (req, res) => {
        req.logout();
        res.send('Logged out')
    })
    
    app.post('/exercise/add', ensureAuthenticated, (req, res) => {
        let {description, duration, date} = req.body;
        User.findById(req.user._id, (err, data) => {
            if (err) {
                console.log(err);
                throw new Error('An error occured. Please try again.')
            } else {
                if (data) {
                    new Exercise({
                        userId: data._id,
                        description: description,
                        duration: duration,
                        date: (!date) 
                            ? new Date()
                            : new Date(date)
                    }).save((err, exercise) => {
                        if (err) {
                            if (err.name == 'CastError' && err['message'].includes('Cast to Number')) {
                                return res.send({
                                    failureMessage: "Invalid duration"
                                })
                            } else if (err['message'].includes('Cast to Date')) {
                                return res.send({
                                    failureMessage: "Invalid date"
                                })
                            } else if (err.name == 'ValidationError') {
                                res.send({
                                    failureMessage: Object.values(err.errors).map(val => val.message)
                                })
                            }
                            res.status(500)
                                .send({
                                    failureMessage: "An error occured, please try again"
                                })
                        }
                        res.send({
                            message: "New exercise added!"
                        })
                    })
                }
            }
        })
    });

    app.put('/edit', ensureAuthenticated, (req, res) => {
        let updates = {};
        for (const [key, value] of Object.entries(req.body)) {
            updates[key] = value
        }
        if (updates.date == '') {
            updates.date = new Date()
        }
        Exercise.findByIdAndUpdate(req.query.id, updates, {
            new: true
        }, (err, doc) => {
            if (err) {
                if (err.name == 'CastError' && err['message'].includes('Cast to Number')) {
                    return res.send({
                        message: "Invalid duration"
                    })
                } else if (err['message'].includes('Cast to date')) {
                    return res.send({
                        message: "Invalid date"
                    })
                }
                return res.status(500)
                    .send({
                        message: "An error occured, please try again"
                    })
            } else {
                return res.send("Exercise edited")
            }
        })
    })

    app.delete('/delete', ensureAuthenticated, (req, res) => {
        Exercise.deleteMany(
            req.query.id 
            ? {_id: req.query.id}
            : {userId: req.user._id}, (err, doc) => {
            if (err) {
                console.log(err);
                return res.status(500)
                    .send({
                        message: "An error occured, please try again"
                    })
            }   else {
                res.send("Exercise deleted")
            }
        })
    })

    app.get('/exercise/log', ensureAuthenticated, (req, res) => {
        let {exerciseId} = req.query;
        Exercise.find(
            exerciseId
            ? {
                _id: exerciseId
            }
            : {
                userId: req.user._id
            }
        ).sort({
            date: 1
        }).exec((err, exercise) => {
            if (err) {
                console.log(err);
                throw new Error('An error occured. Please try again.')
            } else {
                res.send({
                    log: exercise
                })
            }
        })
    })
}