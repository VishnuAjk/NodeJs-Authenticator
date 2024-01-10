const User = require('../models/user')
const passport = require('passport')

function authController() {
    return {
       
        signin(req, res) {
            res.render('auth/signin')
        },

        postSignin(req, res, next) {
            const { username, password } = req.body
            // Validate request 
            if (!username || !password) {
                req.flash('error', 'All fields are required')
                return res.redirect('/signin')

            }
            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    req.flash('error', info.message)
                    return next(err)
                }
                if (!user) {
                    req.flash('error', info.message)
                    return res.redirect('/signin')
                }
                req.logIn(user, (err) => {
                    if (err) {
                        req.flash('error', info.message)
                        return next(err)
                    }

                    return res.redirect('/home');
                })
            })(req, res, next)
        },
        home(req, res) {
            res.render('auth/home')
        },

        // SignUp
        signup(req, res) {
            res.render('auth/signup')
        },
        postSignup(req, res) {
            const { username, email, password } = req.body
            if (!username || !email || !password) {
                req.flash('error', 'All fields are required')
                req.flash('username', username)
                req.flash('email', email)
                return res.redirect('/')
            }
            // Check if email exists 
            User.exists({ email: email }, (err, result) => {
                if (result) {
                    req.flash('error', 'Email already taken')
                    req.flash('username', username)
                    req.flash('email', email)
                    return res.redirect('/')
                }
            })
            User.register({
                username: req.body.username,
                email: req.body.email
            }, req.body.password, function (err) {
                if (err) {
                    req.flash('error', 'something went to wrong')
                    return res.redirect('/')
                } else {
                    return res.redirect('/signin')
                }
            });
        },

        // Reset Password
        reset(req, res) {
            res.render('auth/reset')
        },


        resetPassword(req, res) {
            User.findByUsername(req.body.username, (err, user) => {
                if (err) {
                    req.flash('error', 'plz check your password')
                } else {
                    user.changePassword(req.body.oldpassword,
                        req.body.newpassword, function (err) {
                            if (err) {
                                return res.redirect('/reset');
                            } else {
                                return res.redirect('/signin')
                            }
                        });
                }
            });
        },

        // LOGOUT
        logout(req, res, next) {
            req.logout(function (err) {
                if (err) {
                    return next(err);
                }
                return res.redirect('/')
            });

        }


    }
}
module.exports = authController