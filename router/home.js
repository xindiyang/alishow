const express = require('express');
const router = express.Router();
// 定义路由，显示前台页面
router.get('/', (req, res) => {
    res.render(rootPath + '/view/home/index.html');
});
router.get('/list.html', (req, res) => {
    res.render(rootPath + '/view/home/list.html');
});
router.get('/detail.html', (req, res) => {
    res.render(rootPath + '/view/home/detail.html');
});
module.exports = router;