const express = require('express');
const db= require('../db');
const router = express.Router();
// 管理员信息列表
router.get('/admin/user/users.html',(req,res)=>{
    db('select * from ali_admin', null, (err, result) => {
        if (err) throw err;
        // 查询数据库没有错误，则使用模板引擎分别数据
        // console.log(result);
        res.render(rootPath + '/view/admin/user/users.html', {
            arr: result
        });
    })
});
// 管理员信息添加列表
router.get('/admin/user/adduser.html',(req,res)=>{
    res.render(rootPath+'/view/admin/user/adduser.html')
});
// 管理员信息添加接口
router.post('/admin/user/add',(req,res)=>{
    db('insert into ali_admin set ?',req.body,(err,result)=>{
        if(err) throw err;
        if(result.affectedRows > 0){
             res.send({code:200,message:'ok'});
        }else{
            res.send({code:201,message:'fail'});
        }
    });
});
/* 管理员信息编辑功能 */
   //根据id查询到我们需要修改的管理员信息
     

// 管理员信息删除功能
router.get('/admin/user/delete',function(req,res){
  db('delete from ali_admin where id =?',req.query.id,(err,result)=>{
      if(err) throw err;
      if(result.affectedRows>0){
          res.send("<script>alert('删除成功');location.href = '/admin/user/users.html'</script>")
      }else{
        res.send("<script>alert('删除失败');location.href = '/admin/user/users.html'</script>")
      }
  })
})
module.exports = router;