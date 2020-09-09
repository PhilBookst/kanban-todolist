var express = require('express');
var router = express.Router();
const userController = require('./../controllers/userController');
const { body } = require('express-validator');

router.get('/', (req, res, next) => res.render('signup'));

router.post('/', [
  body('username').not().isEmpty().isLength({min: 5}).trim().escape().withMessage('Must be at least 5 characters long'),
  body('password').not().isEmpty().isLength({min: 5}).trim().escape().withMessage('Must be at least 5 characters long'),
  body('confirm').not().isEmpty().isLength({min: 5}).trim().escape().withMessage('Must be at least 5 characters long'),
], userController.signup);

module.exports = router;