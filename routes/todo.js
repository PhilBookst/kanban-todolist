var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const User = require('../models/user');


/* GET home page. */
router.get('/', function(req, res, next) {
  
  User.findOne({ _id: req.user.id }, (err, user) => {
    
    fs.readFile(path.join(__dirname, `../users/${user.username}/todo.txt`), 'utf8', (err, data) => {
      if(err) { 
      }
      res.render('todoRoute', { data: data });
    });

  })

});

router.post('/', (req, res, next) => {
  let formData = req.body;

  User.findOne({ _id: req.user.id }, (err, user) => {
    
    fs.writeFile(path.join(__dirname, `../users/${user.username}/todo.txt`), formData.todoSubmit, (err) => {
      if(err)  {
        console.log(err);
        res.end("Failed");
      }
    });

  })

});


module.exports = router;