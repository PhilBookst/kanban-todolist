var express = require('express');
var router = express.Router();
const passport = require('passport');
const { body } = require('express-validator');

router.get('/', (req, res, next) => res.render('login', { username: req.flash('usernameErr'), password: req.flash('passwordErr') } ));

router.post('/',[
  body('username').not().isEmpty().isLength({min: 5}).trim().escape(),
  body('password').not().isEmpty().isLength({min: 5}).trim().escape(),
] , passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

module.exports = router;