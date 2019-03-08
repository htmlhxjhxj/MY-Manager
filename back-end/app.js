var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var {
  jsonFormat
} = require('./middlewares')
var {
  baseUrl
} = require('./config')
var indexRouter = require('./routes/index');
var movieRouter = require('./routes/movie');
var fileRouter = require('./routes/file');
var usersRouter = require('./routes/users');

var app = express();


// 使用session
app.use(session({
  secret: 'i love u',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    path: '/', 
    httpOnly: true, 
    secure: false, 
    maxAge: 1000 * 60 * 60 * 2 // 过期时间  ms
  } // 准备种到前端的cookie的相关配置
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// 使用jsonFormat中间件处理所有请求的数据响应格式为application/json
app.use(baseUrl + '/', jsonFormat)

app.use(baseUrl + '/', indexRouter);
app.use(baseUrl + '/movie', movieRouter);
app.use(baseUrl + '/file', fileRouter);
app.use(baseUrl + '/users', usersRouter);



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
  res.render('error', { str: '<h1>哈哈哈哈</h1>' });
});

module.exports = app;