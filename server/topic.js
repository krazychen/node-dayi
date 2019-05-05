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
    /* 回帖周榜sql - 获取的是用户*/
    let replyssql = 'SELECT * FROM topic left JOIN user on topic.uid=user.uid ORDER BY topic.replys desc,topic.lasttime DESC limit 10';

    let data = {session:sess};

    const topics = await dbhelper.query(sql);
    const answers = await dbhelper.query(answerSql);
    const visitUps = await dbhelper.query(visitUpSql);
    const replys = await dbhelper.query(replyssql);

    data.data = topics[0];
    data.answer = answers;
    data.replys = replys;
    data.tclass = '';
    data.tstatus = '';
    data.sort = '';

    if(topics && topics.length > 0){
        data.status=1;
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


router.get('/topics',async (req, res) => {

    let current_page = 1; //默认为1
    let num = 15; //每页条数
    if (req.query.page) {
        current_page = parseInt(req.query.page);
    }
    if (req.query.limit) {
        num = parseInt(req.query.limit);
    }
    let next_page = current_page + 1;
    let tclass=req.query.class;
    let status=req.query.status;
    let sort=req.query.sort;
    let key=req.query.key;

    let sql = 'SELECT * FROM topic left JOIN user on topic.uid=user.uid where 1=1';
    let countsql = 'SELECT count(*) FROM topic left JOIN user on topic.uid=user.uid where 1=1';
    /* 热议sql*/
    let onessql = 'SELECT * FROM topic left JOIN user on topic.uid=user.uid ORDER BY topic.visits desc,topic.lasttime desc limit 12';

    switch (tclass) {
        case "提问" :
            sql += ' and topic.tclass ="提问"';
            countsql += ' and topic.tclass ="提问"';
            break;
        case "分享" :
            sql += ' and topic.tclass ="分享"';
            countsql += ' and topic.tclass ="分享"';
            break;
        case "讨论" :
            sql += ' and topic.tclass ="讨论"';
            countsql += ' and topic.tclass ="讨论"';
            break;
        case "建议" :
            sql += ' and topic.tclass ="建议"';
            countsql += ' and topic.tclass ="建议"';
            break;
        case "公告" :
            sql += ' and topic.tclass ="公告"';
            countsql += ' and topic.tclass ="公告"';
            break;
        case "动态" :
            sql += ' and topic.tclass ="动态"';
            countsql += ' and topic.tclass ="动态"';
            break;
    }
    switch (status) {
        case "未结":
            sql += ' and topic.status="未结"';
            countsql += ' and topic.status="未结"';
            break;
        case "已结":
            sql += ' and topic.status="已结"';
            countsql += ' and topic.status="已结"';
            break;
        case "精华":
            sql += ' and topic.isselect =1';
            countsql += ' and topic.isselect =1';
            break;
    }

    if(key){
        sql += ' and topic.tcontent like "%'+key+'%"';
        countsql += ' and topic.tcontent like "%'+key+'%"';
    }
    switch (sort) {
        case "按最新":
            sql += ' order by topic.lasttime desc';
            break;
        case "按热议":
            sql += ' order by topic.visits desc';
            break;
    }

    // sql +=' limit ' + num + ' offset ' + num * (current_page-1);
    /* 加载所有不进行分页，因此limit一直都是最大 */
    sql +=' limit ' + num * (current_page);

    let topics = await dbhelper.query(sql);
    let count = await dbhelper.query(countsql);
    let ones = await dbhelper.query(onessql);
    let data = {session:req.session};
    data.total = count[0]['count(*)'];
    data.pages = Math.floor(data.total/15)+1;
    data.topics = topics;
    data.ones = ones;
    data.tclass = tclass;
    data.tstatus = status;
    data.sort = sort;
    data.page = current_page;
    if (topics && topics.length > 0) {
        data.status = 1;
    } else {
        data.status = 0;
    }
    res.render("jie/index",data);
});



module.exports = router;