
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)

const {restoreUser} = require('./auth')
const {sessionSecret} = require('./config')
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const { sequelize } = require('./db/models');

const app = express();

// view engine setup
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(sessionSecret));
app.use(express.static(path.join(__dirname, 'public')));
const store = new SequelizeStore({
  db: sequelize,
})
app.use(
  session({
    secret: sessionSecret,
    store,
    resave: false,
  }))
store.sync()
app.use(restoreUser);
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error("The requested resource couldn't be found.");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.status(err.status || 500);
  const isProduction = environment === "production";
  res.json({
    title: err.title || "Server Error",
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack,
  });

  // res.render('errors');
});

module.exports = app;
