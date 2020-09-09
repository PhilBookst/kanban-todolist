var express = require('express');
var router = express.Router();
const userController = require('./../controllers/userController');

function loggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

/* GET ROOT  */
router.get('/', loggedIn, userController.renderKanban);

// CREATE NEW FIELD
router.post('/new', userController.newField);

//REMOVE FIELD
router.delete('/remove', userController.removeField);

// UPDATE FIELD
router.put('/', userController.updateField);

// CREATE TASK  
router.post('/create', userController.createTask);

// DELETE TASK
router.post('/delete', userController.removeTask);

// UPDATE TASK
router.put('/task', userController.updateTask);

// UPDATE POSITION
router.put('/update', userController.updatePosition);


     
module.exports = router;
