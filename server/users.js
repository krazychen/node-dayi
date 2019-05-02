const express = require('express');
const fs = require('fs');
const multer  = require('multer');
const router = express.Router();
const dbhelper = require('../server/dbhelper');

/* 注册服务端 */
router.post('/signup', function (req, res, next) {
    let connection_write = dbhelper.con_write();
    let connection_read = dbhelper.con_read();
    let imgurl="public/images/avatar/2.jpg";
    let sql1 = 'SELECT mail FROM user where mail = "' + req.body.mail + '"';
    let sql = 'INSERT INTO user(mail, username, password, utime, country,pic) VALUES("' + req.body.mail + '", "' + req.body.username + '", "' + req.body.password + '", now(), "中国","'+imgurl+'")';
    connection_read.query(sql1, function (err, data) {
        if (err)
            throw err;
        let status = {
            status: 'success'
        };
        if (data.length > 0) {
            status.status = 'failed';
            connection_write.end();
            connection_read.end();
        } else {
            connection_write.query(sql);
            connection_write.end();
            connection_read.end();
        }
        res.json(status);
    });
});

/** 登录 **/
router.post('/signin', function (req, res, next) {
    let connection_read = dbhelper.con_read();
    let sql = 'SELECT username,mail, uid ,country,province,province_code,city,city_code,area,area_code,utime, sign ,sex,pic,role_type FROM user where mail = "' + req.body.mail + '" and password = "' + req.body.password + '"';
    let sess = req.session;
    connection_read.query(sql, function (err, data) {
        connection_read.end();
        if (err)
            throw err;
        let status = {
            status: 'success'
        };
        if (data.length > 0) {
            sess.views = 1;
            sess.username = data[0].username;
            sess.mail = data[0].mail;
            sess.country = data[0].country;
            sess.utime = data[0].utime;
            sess.sign = data[0].sign;
            sess.sex = data[0].sex;
            sess.province = data[0].province;
            sess.province_code = data[0].province_code;
            sess.city = data[0].city;
            sess.city_code = data[0].city_code;
            sess.area = data[0].area;
            sess.area_code = data[0].area_code;
            sess.role_type = data[0].role_type;
            if(data[0].pic.indexOf("public")!=-1){
                sess.pic=data[0].pic.substring(data[0].pic.indexOf("public")+"public".length,data[0].pic.length);
            }else{
                sess.pic = data[0].pic;
            }
            sess.uid = data[0].uid;
            sess.publishtime = data[0].publishtime || 0;
        } else {
            status.status = 'failed';
        }
        res.json(status);
    });
});

/* 用户设置路由 */
router.get('/index/:user_id', function (req, res, next) {
    // let data = {
    //     title: 'NodeBBS',
    //     session: req.session
    // };
    // res.render('user/index', data);
    let user_id = req.params.user_id;
    let connection_read = dbhelper.con_read();
    let sql = 'SELECT uid, postname, publishtime, pid, pcontent, visits, reply from post where uid= ' + user_id + ' order by publishtime desc limit 10';
    let query = 'select answer.uid, answer.content, answer.pid, post.postname, answer.atime from answer join post on post.pid = answer.pid where answer.uid= ' + user_id + ' order by atime desc limit 10';
    let data = {};
    connection_read.query(sql, function (err, data1) {
        if (err)
            throw err;
        data.session = req.session;
        data.data1 = data1;
        connection_read.query(query, function (err, data2) {
            if (err)
                throw err;
            connection_read.end();
            data.data2 = data2;
            data.session = req.session;
            // console.log(data2);
            res.render('user/index', data);
        });
    });
});


module.exports = router;