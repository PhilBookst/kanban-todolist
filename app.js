require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const compression = require('compression');
const helmet = require('helmet');
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

var indexRouter = require('./routes/index');
const todoRouter = require('./routes/todo');
const signUpRouter = require('./routes/signup');
const loginRouter = require('./routes/login');

var app = express();
app.use(compression());
app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: "'self'",
      scriptSrc: ["'self'", "'unsafe-inline'", "code.jquery.com", "cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "stackpath.bootstrapcdn.com", "cdnjs.cloudflare.com", "cdn.jsdelivr.net"],
      fontSrc: ["cdnjs.cloudflare.com"],
    },
  })
);

// const mongoDB = process.env.MONGO_URI;
const mongoDB = process.env.MONGO_CLOUD;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database error'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({ secret: process.env.PASSPORT_S, resave: false, saveUninitialized: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use('local-login',
  new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
  }, function(req, username, password, done) {
    User.findOne({ username: username }, (err, user) => {
      if (err) { 
        return done(err);
      };
      if (!user) {
        return done(null, false, req.flash('usernameErr', 'Invalid Username') );
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if(res) {
          return done(null, user);
        } else {
          return done(null, false, req.flash('passwordErr', 'Invalid Password') );
        }
      });
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.PASSPORT_S));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/todo', todoRouter);
app.use('/sign-up', signUpRouter);
app.use('/login', loginRouter);

app.use('/', indexRouter);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
