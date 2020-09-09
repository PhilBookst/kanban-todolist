const 
  bcrypt = require('bcryptjs'),
  { validationResult } = require('express-validator'),
  fs = require('fs'), path = require('path');

const Kanban = require('../models/kanban');
const User = require('../models/user');

exports.signup = (req, res, next) => {

  const err = validationResult(req);

  if(!err.isEmpty()) {
    console.log('here');
    return res.render('signup', { errors: err.array() });
  }

  bcrypt.hash(req.body.password, 10, (err, hashed) => {
    bcrypt.compare(req.body.confirm, hashed, (err, result) => {
      if(!result) { 
        console.log(err);
        return res.render('signup', {err: 'Password does not match'})
      }
      
      const user = new User({
        username: req.body.username,
        password: hashed,
        kanbans: [],
      });
      
      user.save(err => {
        if (err) { 
          return next(err);
        };
      });

      try {
        fs.mkdir(path.join(__dirname, '..', 'users', req.body.username), { recursive: true }, err => {
          fs.writeFile(path.join(__dirname, '..', 'users', req.body.username, 'todo.txt'), 'Todo-List:', 'utf-8', err => {} );
        });
      } catch (error) {
        next(error);
      }
      res.redirect('/login');

    });
    
  });

}

exports.renderKanban = async(req, res, next) => {

  try {

    await Kanban.find({ author: req.user.id }).populate().exec((err, kanban) => {
      if(err) { console.log(err); return; };
  
      User.findOne({ _id: req.user.id }).populate().exec((err, user) => {
        if(err) { console.log(err); return;}
  
        kanban.forEach((kan) => {
          User.updateOne({ _id: req.user.id }, {$addToSet: {fields: kan.due} }, (err) => {});
        });
  
        res.render('kanban', { dates: user.fields, tasks: kanban, user: req.user });
      });
    });

  } catch (error) {
    next(error);
  }

}

exports.createTask = async(req, res, next) => {
  try {
    const formData = req.body;

    const task = new Kanban({
      author:  req.user.id,
      task: formData.task, 
      due: formData.due, 
    });
    
    const saved = await task.save(function(err) {
      if(err) {console.log(err); return; };
    });

    await User.updateOne({_id: req.user.id}, { $push: { kanbans: task } }, (err) => {});

    res.redirect('/');
    
  } catch (error) {
    next(error);
  }
}

exports.removeTask = async(req, res, next) => {
  async function wait(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }

  try {
    await Kanban.updateOne({ author: req.user.id, task: req.body.id }, { due: "Finished"}, (err) => {});
    await wait(1000*60);
    await Kanban.deleteOne( { author: req.user.id, task: req.body.id, due: 'Finished' }, (err) => {});
  } catch (error) {
    next(error);
  }

}

// TODO: update task content

exports.updatePosition = async(req, res, next) => {

  try {
    await Kanban.updateOne({ author: req.user.id, task: req.body.id}, { due: req.body.nextDue}, (err) => {});
  } catch (error) {
    next(error);
  }

}

exports.newField = async(req, res, next) => {

  try { 
    await User.updateOne({ _id: req.user.id }, { $addToSet: { fields: req.body.due } }, (err) => {});
  } catch (error) {
    next(error);
  }

}

exports.removeField = async(req, res, next) => {

  try {
    await User.updateOne({ _id: req.user.id }, { $pull: { fields: req.body.field } }, (err) => {});
  } catch (error) {
    next(error);
  }

}

exports.updateField = async(req, res, next) => {

  try {
    await User.updateOne({ _id: req.user.id, fields: req.body.id }, { $set: { "fields.$" : req.body.newID } }, (err) => {} );
    await Kanban.updateMany( { author: req.user.id, due: req.body.id }, { due: req.body.newID }, (err) => {} );
  } catch (error) {
    next(error);
  }

}

exports.updateTask = async(req, res, next) => {
  
  try {
    
    await Kanban.updateOne( { author: req.user.id, task: req.body.task }, { task: req.body.newTask }, (err) => {} );

  } catch (error) {
    next(error);
  }

}
