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
    let sql = 'INSERT INTO user(mail, username, password, utime, city,pic,role_type) ' +
        ' VALUES("' + req.body.mail + '", "' + req.body.username + '", "' +
        req.body.password + '", now(), "中国","'+imgurl+'","'+req.body.roleType+'")';
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
    let sql = 'SELECT * FROM user where mail = "' + req.body.mail + '" and password = "' + req.body.password + '"';
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
            sess.utime = data[0].utime;
            sess.sign = data[0].sign;
            sess.sex = data[0].sex;
            sess.city = data[0].city;
            sess.role_type = data[0].role_type;
            sess.experience = data[0].experience;
            sess.checkintime = data[0].checkintime;
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

/* 退出服务端 */
router.get('/logout', function (req, res, next) {
    req.session.destroy();
    res.redirect('/');
});

/* 用户设置路由 */
router.get('/set', function (req, res, next) {
    let data = {
        session: req.session
    };
    res.render('user/set', data);
});


/* 用户主页路由 */
router.get('/home', function (req, res, next) {
    let user_id = req.session.uid;
    let connection_read = dbhelper.con_read();
    let sql = 'SELECT uid, postname, publishtime, pid, pcontent, visits, reply from post where uid= ' + user_id + ' order by publishtime desc limit 10';
    let data = {};
    connection_read.query(sql, function (err, data1) {
        if (err)
            throw err;
        data.session = req.session;
        data.data1 = data1;
        res.render('user/home', data);
    });
});

/* 修改用户资料 */
router.post('/profile', function (req, res, next) {

    let user_id = req.session.uid;
    let sess = req.session;
    let connection_write = dbhelper.con_write();
    let connection_read = dbhelper.con_read();
    let sqlUser = 'SELECT * FROM user where uid = "' + user_id + '" ';
    let username = req.body.username;
    let sex = req.body.sex;
    let city = req.body.city;
    let signtext = req.body.sign;
    let sql = 'UPDATE user SET '
            + 'username="'+username+'", sex ="'+sex +'", city="'+city
            +'", sign="'+signtext+'"' +' where uid="' + user_id + '"';
    connection_write.query(sql, function (err, profileData) {
        connection_write.end();
        if (err) throw err;
        connection_read.query(sqlUser, function (err, data) {
            connection_read.end();
            if (err)
                throw err;
            let status = {
                status: 1
            };
            if (data.length > 0) {
                sses.views = 1;
                sess.username = data[0].username;
                sess.mail = data[0].mail;
                sess.utime = data[0].utime;
                sess.sign = data[0].sign;
                sess.sex = data[0].sex;
                sess.city = data[0].city;
                sess.role_type = data[0].role_type;
                sess.experience = data[0].experience;
                sess.checkintime = data[0].checkintime;
                if(data[0].pic.indexOf("public")!=-1){
                    sess.pic=data[0].pic.substring(data[0].pic.indexOf("public")+"public".length,data[0].pic.length);
                }else{
                    sess.pic = data[0].pic;
                }
                sess.uid = data[0].uid;
                sess.publishtime = data[0].publishtime || 0;
            } else {
                status.status = 0;
            }
            status.session=sess;
            res.send(status);
        });
    });
})


var createFolder = function(folder){
    try{
        fs.accessSync(folder);
    }catch(e){
        fs.mkdirSync(folder);
    }
};

var uploadFolder = './public/images/ue/';

createFolder(uploadFolder);

// 通过 filename 属性定制
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        cb(null, file.originalname);
    }
});

// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({
    storage: storage
});

/* 修改头像 */
router.post('/avatar', upload.single('file'), function (req, res, next) {

    var file = req.file;
    let user_id = req.params.user_id;
    let sess = req.session;

    const imgurl = file.path;
    let connection_write = dbhelper.con_write();
    let sql = 'UPDATE user SET pic="'+imgurl+'" where uid="' + user_id + '"';
    connection_write.query(sql, function (err, data) {
        if (err) throw err;
        let status = {
            status: 1
        };
        connection_write.end();
        if(imgurl.indexOf("public")!=-1){
            sess.pic=imgurl.substring(imgurl.indexOf("public")+"public".length,imgurl.length);
        }else{
            sess.pic = imgurl;
        }
        // sess.save();
        data.session=sess;
        data.status=status;
        res.send(data);
    });
})

/* 修改用户密码 */
router.post('/changpassw', function (req, res, next) {
    let user_id = req.session.uid;
    let sess = req.session;
    let connection_write = dbhelper.con_write();
    let curpass = req.body.curpass;
    let newpass = req.body.newpass;
    let sql = 'UPDATE user SET '
        + 'password="'+newpass+'" where uid="' + user_id + '" and password="'+curpass+'"';
    connection_write.query(sql, function (err, data) {
        connection_write.end();
        if (err) throw err;
        let status = {
        };
        if(data.changedRows==0){
            status.status=0;
        }else{
            status.status=1;
        }
        status.session=sess;
        res.send(status);
    });
})

/* 签到 */
router.post('/checkin', function (req, res, next) {
    console.log('11');
    let user_id = req.session.uid;
    let sess = req.session;
    let connection_write = dbhelper.con_write();
    let connection_read = dbhelper.con_read();
    let sql = 'UPDATE user SET '
        + 'experience=experience+5 ,checkintime=now() where uid="' + user_id + '" ';
    console.log(sql)
    let insertSql = 'insert into user_exp_record (uid,exp_type,exp_opt,exp_num) '+
        ' values("'+user_id+'","增加","签到",5)';

    let sqlUser = 'SELECT * FROM user where uid = "' + user_id + '" ';
    let data = {};

    connection_write.query(sql, function (err, val) {
        if (err) throw err;
        connection_write.query(insertSql, function (err, insertdata) {
            if (err) throw err;
            connection_read.query(sqlUser, function (err, sqldata) {
                connection_write.end();
                connection_read.end();
                if (err)
                    throw err;
                data.status= 1
                if (sqldata.length > 0) {
                    sess.views = 1;
                    sess.username = sqldata[0].username;
                    sess.mail = sqldata[0].mail;
                    sess.country = sqldata[0].country;
                    sess.utime = sqldata[0].utime;
                    sess.sign = sqldata[0].sign;
                    sess.sex = sqldata[0].sex;
                    sess.province = sqldata[0].province;
                    sess.city = sqldata[0].city;
                    if (sqldata[0].pic.indexOf("public") != -1) {
                        sess.pic = sqldata[0].pic.substring(sqldata[0].pic.indexOf("public") + "public".length, sqldata[0].pic.length);
                    } else {
                        sess.pic = sqldata[0].pic;
                    }
                    sess.uid = sqldata[0].uid;
                    sess.publishtime = sqldata[0].publishtime || 0;
                } else {
                    data.status = 0;
                }
                data.session = sess;
                res.send(data);
            });
        });
    });
})

module.exports = router;