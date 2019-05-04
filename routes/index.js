var express = require('express');
var router = express.Router();

/* 主页跳转 */
router.get('/', function (req, res, next) {
  let data = {
    session: req.session,
  };
  res.render('index', data);
});

/* 页面跳转 - 登录跳转 */
router.get('/login', function (req, res, next) {
  let data = {
    session: req.session
  };
  res.render('user/login', data);
});

/* 页面跳转 - 注册跳转 */
router.get('/reg', function (req, res, next) {
  let data = {
    session: req.session
  };
  res.render('user/reg', data);
});

/* 页面跳转 - 我要发帖 */
router.get('/add', function (req, res, next) {
  let data = {
    session: req.session
  };
  res.render('jie/add', data);
});

module.exports = router;
