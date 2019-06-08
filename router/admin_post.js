const express = require('express');
const db = require('../db');
const router = express.Router();
// 显示文章列表
router.get('/admin/post/posts.html', (req, res) => {
    let sql =  `select a.article_id, a.article_title, b.admin_nickname, c.cate_name, a.article_addtime, a.article_state from ali_article a 
    join ali_admin b on a.article_adminid = b.admin_id 
    join ali_cate c on a.article_cateid = c.cate_id`;
    db(sql, null, (err, result) => {
        if (err) throw err;
        res.render(rootPath + '/view/admin/post/posts.html', {
            arr: result
        });
    });
});
// 添加文章
router.get('/admin/post/addpost.html', (req, res) => {
    db('select * from ali_cate' ,null,(err,result)=>{
        if(err) throw err;
        res.render(rootPath + '/view/admin/post/addpost.html',{
            cate:result
        })
    });
});
module.exports = router;