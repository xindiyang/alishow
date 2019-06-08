// admin 对应 admin模板文件夹
// admin路由文件 处理的是admin中的index.html 和 login.html

const express = require('express');
const router = express.Router();

router.get('/admin/index.html', (req, res) => {
    res.render(rootPath + '/view/admin/index.html');
});

// 显示登录页面
router.get('/admin/login.html', (req, res) => {
    res.render(rootPath + '/view/admin/login.html');
});

module.exports = router;