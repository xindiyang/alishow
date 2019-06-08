const express = require('express');
const db = require('../db');
const moment = require('moment');
const router = express.Router();
//完成栏目列表页
router.get('/admin/cate/cate.html', (req, res) => {
    db('select *from ali_cate', null, (err, result) => {
        if (err) throw err;
        res.render(rootPath + '/view/admin/cate/cate.html', {
            arr: result
        });
    });
});
/* 完成添加栏目 */
//显示后台栏目列表
router.get('/admin/cate/addcate.html', (req, res) => {
    res.render(rootPath + '/view/admin/cate/addcate.html')
});
//完成添加栏目
router.post('/admin/cate/add', (req, res) => {
    req.body.cate_addtime = moment().format('YYYY-MM-DD');
    console.log(req.body);
    db('insert into ali_cate set ?', req.body, (err, result) => {
        if (err) throw err;
        console.log(result);
        if (result.affectedRows > 0) {
            res.send({
                code: 200,
                message: '添加栏目成功'
            });
        } else {
            res.send({
                code: 201,
                message: '添加栏目失败'
            });
        }
    })
});
//删除栏目列表功能方案1
router.get('/admin/cate/delete', (req, res) => {
    db('delete from ali_cate where cate_id=?', req.query.id, (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
            res.send('<script> alert("删除成功"); location.href = "/admin/cate/cate.html"; </script>');
        } else {
            res.send('<script>alert("删除失败"); location.href="/admin/cate/cate.html";</script>');
        }
    })
})
/* 修改栏目列表数据 */
//获取修改的信息
router.get('/admin/cate/edit.html',(req,res)=>{
    db('select * from ali_cate where cate_id = ?',req.query.id,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.render(rootPath + '/view/admin/cate/edit.html',{
            row:result[0]
        });
    });
});
//完成修改信息
router.post('/admin/cate/update',(req,res)=>{
    db('update ali_cate set ? where cate_id = ?',[req.body,req.body.cate_id],(err,result)=>{
        if(err) throw err;
        console.log(result);
        if(result.affectedRows > 0){
            res.send({code:200,message:'更新栏目成功'});
        }else{
            res.send({code:200,message:'更新栏目失败'});
        }
    });
});
//
module.exports = router;