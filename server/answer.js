const express = require('express');
const router = express.Router();
const dbhelper = require('../server/dbhelper');

/* 添加回复 */
router.post('/add',async (req, res) => {

    let tid = req.body.tid;
    let uid = req.session.uid;
    let content = req.body.content;
    let parent_aid = req.body.paid?req.body.paid:req.body.tid;

    let sql = "INSERT INTO answer(tid,uid,content,atime,parent_aid) " +
        " VALUES('" + tid + "','" + uid + "','" + content + "',now(),'"+parent_aid+"')";
    let replyUpSql = 'update topic set replys=replys+1 where tid = "' + tid + '"';
    // console.log(sql);
    // console.log(replyUpSql);

    let data = {session:req.session};
    const replys = await dbhelper.query(sql);

    /* 如果没有正常更新回复，则返回错误*/
    if(replys.affectedRows!=1) {
        data.status = 0;
    }else{
        /* 如果正常更新回复，则更新帖子回复次数*/
        const replyUp = await dbhelper.query(replyUpSql);
        data.status = 1;
    }

    res.json(data);
});

/* 回复点赞 */
router.post('/dianzan',async (req, res) => {

    let aid = req.body.aid;

    let dianzanSql = 'update answer set afavor=afavor+1 where aid = "' + aid + '"';

    let data = {session:req.session};
    const dianzans = await dbhelper.query(dianzanSql);

    /* 如果没有正常更新回复，则返回错误*/
    if(dianzans.affectedRows!=1) {
        data.status = 0;
    }else{
        data.status = 1;
    }

    res.json(data);
});

/* 回复编辑 */
router.post('/edit',async (req, res) => {

    let aid = req.body.aid;
    let content = req.body.content;

    let sql = 'update answer set content="'+content+'" where aid = "' + aid + '"';

    let data = {session:req.session};
    const rows = await dbhelper.query(sql);

    /* 如果没有正常更新回复，则返回错误*/
    if(rows.affectedRows!=1) {
        data.status = 0;
    }else{
        data.status = 1;
    }

    res.json(data);
});


/* 删除回复 */
router.post('/del',async (req, res) => {

    let aid = req.body.aid;
    let tid = req.body.tid;

    let sql = "delete from answer where aid= " +aid;
    let replyDownSql = 'update topic set replys=replys-1 where tid = "' + tid + '"';

    let data = {session:req.session};
    const replys = await dbhelper.query(sql);

    /* 如果没有正常删除回复，则返回错误*/
    if(replys.affectedRows!=1) {
        data.status = 0;
    }else{
        /* 如果正常删除回复，则更新帖子回复次数*/
        const replyDown = await dbhelper.query(replyDownSql);
        data.status = 1;
    }

    res.json(data);
});

/* 采纳回复 */
router.post('/acceptan',async (req, res) => {

    let aid = req.body.aid;
    let tid = req.body.tid;

    let sql = "update answer set  isaccept=1, accepttime=now() where aid= " +aid;
    let sql2 = 'update topic set status="已结" where tid = "' + tid + '"';

    let data = {session:req.session};
    const rows = await dbhelper.query(sql);

    /* 如果没有正常采纳答案，则返回错误*/
    if(rows.affectedRows!=1) {
        data.status = 0;
    }else{
        /* 如果正常采纳答案，则更新帖子状态*/
        const rows2 = await dbhelper.query(sql2);
        data.status = 1;
    }

    res.json(data);
});

module.exports = router;