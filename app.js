const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

/* 功能性菜单跳转请求路由 */
const indexRouter = require('./routes/index');

/* 用户服务后台服务器请求路由 */
const serverUsersRouter = require('./server/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  ////这里的name值得是cookie的name，默认cookie的name是：connect.sid
  name: 'nodebss',
  secret: 'node_bss_secret',
  cookie: ('name', 'value', {path: '/', httpOnly: true, secure: false, maxAge: 600000}),
  store: new FileStore(),
  //重新保存：强制会话保存即使是未修改的。默认为true但是得写上
  resave: true,
  //强制“未初始化”的会话保存到存储。
  saveUninitialized: true,
}));

app.use('/', indexRouter);
app.use('/server/users',serverUsersRouter);

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
