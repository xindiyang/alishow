// 接口

//1. 加载express模块
const express = require('express');

//2. 创建路由模块
const router = express.Router();

//3. 加载其他所需模块
const path = require('path');
const db = require('..//db');
const moment = require('moment');

//检测登录信息
router.post('/api/login/checkLogin', (req, res) => {
    const email  = req.body.email;
    const passwd = req.body.pwd;
    const sql = 'select * from ali_admin where admin_email=?';

    db(sql, email, (err, result) => {
        if (err || result.length != 1) {
            return res.send({code:201, message:"用户名错误"});
        }

        if (result[0].admin_pwd != passwd) {
            return res.send({code:202, message:"密码错误"});
        }

        //登录成功后，注册session
        req.session.isLogin = true;
        req.session.userInfo = result[0];

        res.send({code:200, message:"登录成功"});
    })
});

//退出登录
router.post('/api/login/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send({code:201, message:"退出失败"});
        }
        res.send({code:200, message:"退出成功"});
    });
});

//根据管理员id获取管理员信息
router.post('/api/center/getAdminById', (req, res) => {
    const id = req.session.userInfo.admin_id;
    const sql = 'select * from ali_admin where admin_id=?';
    db(sql, id, (err, result) => {
        if (err || result.length != 1) {
            return res.send({code: 201, message: "获取管理员信息失败"});
        }

        res.send({code:200, message: "获取管理员信息成功", data: result[0]});
    });
});

const multer = require('multer');
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

let upload = multer({ storage: storage })
//文件上传
router.post('/api/uploads', upload.single('avatar'), (req, res) => {
    res.send({code:200, message:"上传成功", path: '\\' + req.file.path});
});
//更新个人信息
router.post('/api/center/personal', (req, res) => {
    const data = {
        admin_email: req.body.email,
        admin_nickname: req.body.nickname,
        admin_sign: req.body.sign
    };

    if (req.body.pic != '') {
        data.admin_pic = req.body.pic
    }

    const id = req.session.userInfo.admin_id;

    const sql = 'update ali_admin set ? where admin_id=?';

    db(sql, [data, id], (err, result) => {
        if (err || result.affectedRows != 1) {
            return res.send({code:201, message:"更新个人信息失败"});
        }

        req.session.userInfo.admin_email = req.body.email;
        req.session.userInfo.admin_nickname = req.body.nickname;
        req.session.userInfo.admin_sign = req.body.sign;

        res.send({code:200, message:"更新个人信息成功", data: req.session.userInfo});
    })
});

//修改密码
router.post('/api/center/passwd', (req, res) => {
    const oldpwd = req.body.oldpwd;
    const newpwd = req.body.newpwd;
    const id = req.session.userInfo.admin_id;

    let sql = 'select * from ali_admin where admin_id=? and admin_pwd=?';

    db(sql, [id, oldpwd], (err, result) => {
        if (err || result.length != 1) {
            return res.send({code: 201, message: "原密码错误"});
        }

        sql = 'update ali_admin set ? where admin_id=?';
        const data = {admin_pwd: newpwd};
        db(sql, [data, id], (err, result) => {
            if (err || result.affectedRows != 1) {
                return res.send({code:202, message:"更新密码失败"});
            }

            res.send({code:200, message:"更新密码成功"});
        })
    })
})


//获取总页数
router.get('/api/post/getPageTotal', (req, res) => {
    const sql = `select count(*) num from ali_article 
                    join ali_cate on cate_id=article_cateid
                    join ali_admin on admin_id=article_adminid`;

    const pagesize = 2;

    db(sql, null, (err, result) => {
        if (err) {
            return res.send({code: 201, message:"获取分页信息失败"});
        }

        const pageTotal = Math.ceil(result[0].num / pagesize);
        res.send({code:200, message:"获取分页信息成功", data: pageTotal});
    })
});

//分页
router.post('/api/post/page', (req, res) => {
    const pageno = req.body.pageno || 1;
    const pagesize = 2;
    let start = (pageno - 1) * pagesize;
    const sql = `select * from ali_article 
                    join ali_cate on cate_id=article_cateid
                    join ali_admin on admin_id=article_adminid
                    limit ${start},${pagesize}`;

    db(sql, null, (err, result) => {
        if (err || result.length == 0) {
            return res.send({code: 201, message:"获取文章列表失败"});
        }

        res.send({code:200, message:"获取文章列表成功", data: result});
    })
});

//批量删除文章
router.get('/api/post/delposts', (req, res) => {
    const ids = req.query.ids;
    const sql = `delete from ali_article where article_id in (${ids})`;

    db(sql, null, (err, result) => {
        if (err || result.affectedRows == 0) {
            return res.send({code: 201, message:"删除文章失败"});
        }

        res.send({code:200, message:"删除文章成功"});
    })
});

//添加新文章
router.post('/api/post/addpost', (req, res) => {
    //1. 接收表单数据
    const data = {
        article_title: req.body.title,
        article_desc: req.body.desc,
        article_text: req.body.content,
        article_adminid: req.session.userInfo.admin_id,
        article_cateid: req.body.category,
        article_addtime: moment().format('YYYY-MM-DD HH:mm:ss'),
        article_file: req.body.pic,
        article_state: req.body.status,
        article_click: parseInt(Math.random() * 3000),
        article_good: parseInt(Math.random() * 1000),
        article_bad: parseInt(Math.random() * 200),
        article_focus: 1,
    };
    // console.log(data);


    //2. 编写SQL语句
    const sql = 'insert into ali_article set ?';

    //3. 执行SQl语句
    db(sql, data, (err, result) => {
        //4. 处理SQl执行结果
        if (err || result.affectedRows != 1) {
            return res.send({code:201, message:"添加新文章失败"});
        }

        res.send({code:200, message:"添加新文章成功"});
    })
});


//获取栏目信息
router.post('/api/cate/getCate', (req, res) => {
    db('select * from ali_cate', (err, result) => {
        if (err) {
            return res.send({code:201, message:"获取栏目信息失败"});
        }

        res.send({code:200, message:"获取栏目信息成功", data:result});
    })
})


//获取轮播图列表数据
router.post('/api/other/slides', (req, res) => {
    const sql = 'select * from ali_pic';
    db(sql, null, (err, result) => {
        if (err) {
            return res.send({code:201, message:"获取轮播图数据失败"});
        }

        res.send({code:200, message:"获取轮播图数据成功", data: result});
    })
});

// 添加轮播图
router.post('/admin/other/addSildes', (req, res) => {
    const data = {
        pic_url: req.body.image_hidden,
        pic_text: req.body.text,
        pic_link: req.body.link
    };

    let sql = 'insert into ali_pic set ?';

    db(sql, data, (err, result) => {
        if (err || result.affectedRows != 1) {
            return res.send({code:201, message:"添加新轮播图失败"});
        }

        sql = 'select * from ali_pic where pic_id=?';
        db(sql, result.insertId, (err, result) => {
            if (err || result.length != 1) {
                return res.send({code:202, message:"获取新轮播图数据失败"});
            }

            res.send({code:200, message:"添加新轮播图成功", data: data});
        })
    })
});


module.exports = router;