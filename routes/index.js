const express = require('express');
const router = express.Router();
const request = require('request');
const dbhelper = require('../server/dbhelper');

/* 主页跳转 */
// router.get('/', function (req, res, next) {
//   request('http://localhost:3000/server/topics/tops', function (err, val, body) {
//     if (err)
//       throw err;
//     let data = {
//       session: req.session,
//       tops: JSON.parse(body).data
//     };
//     console.log(data)
//     res.render('index', data);
//   });
// });
router.get('/',async (req, res) => {

    /* 置顶sql*/
    let topssql = 'SELECT * FROM topic left JOIN user on topic.uid=user.uid where istop=1 ORDER BY topic.lasttime DESC limit 5';
    /* 置顶sql*/
    let selectssql = 'SELECT * FROM topic left JOIN user on topic.uid=user.uid where isselect=1 ORDER BY topic.lasttime DESC limit 5';
    /* 热议sql*/
    let onessql = 'SELECT * FROM topic left JOIN user on topic.uid=user.uid ORDER BY topic.visits desc,topic.lasttime desc limit 12';
    /* 回帖周榜sql - 获取的是用户*/
    let replyssql = 'SELECT * FROM topic left JOIN user on topic.uid=user.uid ORDER BY topic.replys desc,topic.lasttime DESC limit 10';
    /* 最新帖子sql*/
    let topicssql = 'SELECT * FROM topic left JOIN user on topic.uid=user.uid ORDER BY topic.lasttime DESC limit 15';

    const tops = await dbhelper.query(topssql);
    const selects = await dbhelper.query(selectssql);
    const ones = await dbhelper.query(onessql);
    const replys = await dbhelper.query(replyssql);
    const topics = await dbhelper.query(topicssql);

    let data = {
        session: req.session,
        tops: tops,
        selects:selects,
        ones:ones,
        replys:replys,
        topics:topics
    };
    console.log(data)
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
