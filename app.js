var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var connection = require('./bin/database');
var session = require('express-session');

var dotenv = require('dotenv');
dotenv.config();

var router = express.Router();
require('./routes/default')(router);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const SESSION_SECRET = process.env.SESSION_SECRET;
app.use(session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {secure: false} // set to true if you're using https
}));

app.use('/', router);
app.use('/static', express.static(path.join(__dirname, 'node_modules')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
