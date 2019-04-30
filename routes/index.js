var express = require('express');
var router = express.Router();

/* 主页跳转 */
router.get('/', function (req, res, next) {
  let data = {
    title: 'NodeBBS',
    session: req.session,
  };
  res.render('index', data);
});


/* 页面跳转 - 登录跳转 */
router.get('/login', function (req, res, next) {
  let data = {
    title: 'NodeBBS',
    session: req.session
  };
  res.render('user/login', data);
});

router.get('/reg', function (req, res, next) {
  let data = {
    title: 'NodeBBS',
    session: req.session
  };
  res.render('user/reg', data);
});

module.exports = router;
