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

/* 获取帖子详情 */
router.get('/topic/:topic_id',async (req, res) => {
    let connection_read = dbhelper.con_read();
    let connection_write = dbhelper.con_write();
    let sess=req.session;
    let tid = req.params.topic_id;
    let sql = 'SELECT * FROM topic left JOIN user on topic.uid=user.uid where tid = "' + tid + '"';
    let answerSql = 'SELECT * FROM answer NATURAL JOIN user where pid = "' + tid + '"';
    let visitUpSql = 'update topic set visits=visits+1 where tid = "' + tid + '"';

    let data = {session:sess};

    const topics = await dbhelper.query(sql);
    if(topics && topics.length > 0){
        data.data = topics[0];
        data.status=1;
        const answers = await dbhelper.query(answerSql);
        const visitUps = await dbhelper.query(visitUpSql);
        data.reply = answers;
    }else{
        data.status=0;
    }
    res.render("jie/detail",data);
    // console.log(sql);
    // connection_read.query(sql, function (err, val) {
    //     if (err)
    //         throw err;
    //     console.log(val)
    //     if (val && val.length > 0) {
    //         data.data = val[0];
    //         data.status = 'success';
    //         connection_write.query(sql2, function (err, val) {
    //             if (err)
    //                 throw err;
    //             connection_read.query(sql1, function (err, val) {
    //                 if (err)
    //                     throw err;
    //                 if (val && val.length > 0) {
    //                     data.reply = val;
    //                     data.status = 'success';
    //                 } else {
    //                     data.status = 'failed';
    //                 }
    //                 console.log(data)
    //                 res.render("jie/detail",data);
    //             })
    //         })
    //     } else {
    //         data.status = 'failed';
    //         res.render("jie/detail",data);
    //     }
    //
    // })
});

//获得置顶的帖子,只获取前5条
router.post('/tops',async (req, res) => {

    let sql = 'SELECT * FROM topic left JOIN user on topic.uid=user.uid where istop=1 ORDER BY topic.lasttime DESC limit 5';
    let rows = await dbhelper.query(sql);
    let data = {};
    if (rows && rows.length > 0) {
        data.data = rows;
        data.status = 1;
    } else {
        data.status = 0;
    }
    res.json(data);
});


router.get('/topics', function (req, res) {

    let connection_read = dbhelper.con_read();
    // 在这里添加代码
    let current_page = 0; //默认为1
    let num = 15; //每页条数
    if (req.query.page) {
        current_page = parseInt(req.query.page);
    }
    if (req.query.limit) {
        num = parseInt(req.query.limit);
    }
    let next_page = current_page + 1;
    let sql = 'SELECT * FROM post natural join user ORDER BY lasttime DESC limit ' + num + ' offset ' + num * (current_page-1);
    if(req.query.sort) {
        sql = 'SELECT * FROM post natural join user ORDER BY reply DESC limit ' + num + ' offset ' + num * (current_page-1);
    }
    if(req.query.type) {
        sql = 'SELECT * FROM post natural join user where post.type_id="'+req.query.type+'" ORDER BY lasttime DESC limit ' + num + ' offset ' + num * (current_page-1);
    }
    if(req.query.key){
        sql = 'SELECT * FROM post natural join user where postname like "%'+req.query.key+'%" ORDER BY lasttime DESC limit ' + num + ' offset ' + num * (current_page-1);
    }

    let topicTypeSql = 'select topic,type_id,count(topic) from post GROUP BY topic,type_id ORDER BY count(topic) desc limit 10';

    let countSql ='SELECT count(*) FROM post natural join user';
    if(req.query.type){
        countSql = 'SELECT count(*) FROM post natural join user where post.type_id="'+req.query.type+'"';
    }

    let data = {};
    connection_read.query(sql, function (err, val) {
        // connection_read.end();
        if (err)
            throw err;
        if (val && val.length > 0) {
            data.data = val;
            data.status = 'success';
        } else {
            data.status = 'failed';
        }
        connection_read.query(topicTypeSql, function (err, topicTypes) {
            data.topicTypes=topicTypes;

            connection_read.query(countSql, function (err, counts) {
                connection_read.end();
                // console.log(counts)
                data.total = counts[0]['count(*)'];
                data.pages = Math.floor(data.total/15)+1;
                // console.log(data.pages);
                res.json(data);
            });
            // res.json(data);
        });

    })
});



module.exports = router;