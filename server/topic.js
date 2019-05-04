const express = require('express');
const router = express.Router();
const dbhelper = require('../server/dbhelper');

router.post('/add', function (req, res, next) {
    let connection_write = dbhelper.con_write();
    let connection_read = dbhelper.con_read();
    let sess = req.session;
    let sql =
        " INSERT INTO topic (title,publishtime,lasttime,uid,tclass, tcontent,experience,status )" +
        " VALUES('" + req.body.title + "', now(),now(),'"+ req.session.uid +
        " ','" + req.body.class + "','" +req.body.content+
        " ','" + req.body.experience + "','未结')";
    let data = {session:sess};
    connection_write.query(sql, function (err, val) {
        connection_write.end();
        if (err) throw err;
        console.log(val);
        //如果没有返回insertId，affectedRows为0，则提示新增失败；
        if(val.affectedRows!=1){
            data.status=0;
            res.json(data);
        }else{
            const querySql="SELECT * FROM topic where tid='"+val.insertId+"'";
            connection_read.query(querySql, function (err, queryVal) {
                console.log(queryVal)
                connection_read.end();
                if (err)
                    throw err;
                if(queryVal.length>0){
                    data.status=1;
                }else{
                    data.status=0;
                }
                data.data=queryVal;
                res.json(data);
            })
        }

    });
});

router.get('/topic/:topic_id', function (req, res, next) {
    let connection_read = dbhelper.con_read();
    let connection_write = dbhelper.con_write();
    let sess=req.session;
    let tid = req.params.topic_id;
    let sql = 'SELECT * FROM topic left JOIN user on topic.uid=user.uid where tid = "' + tid + '"';
    let sql1 = 'SELECT * FROM answer NATURAL JOIN user where pid = "' + tid + '"';
    let sql2 = 'update topic set visits=visits+1 where tid = "' + tid + '"';

    let data = {session:sess};
    console.log(sql);
    connection_read.query(sql, function (err, val) {
        if (err)
            throw err;
        console.log(val)
        if (val && val.length > 0) {
            data.data = val[0];
            data.status = 'success';
            connection_write.query(sql2, function (err, val) {
                if (err)
                    throw err;
                connection_read.query(sql1, function (err, val) {
                    if (err)
                        throw err;
                    if (val && val.length > 0) {
                        data.reply = val;
                        data.status = 'success';
                    } else {
                        data.status = 'failed';
                    }
                    console.log(data)
                    res.render("jie/detail",data);
                })
            })
        } else {
            data.status = 'failed';
            res.render("jie/detail",data);
        }

    })
});


module.exports = router;