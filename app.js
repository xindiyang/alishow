// 1.加载所需要的模块
const template = require('express-art-template');
const session = require('express-session');
const bodyParser = require('body-parser');

// 2.搭建服务器
const express = require('express');
const app = express();
app.listen(3000, () => {
    console.log('爸爸来了');
})
// 3.通用配置
// 2.1配置模板的处理方式
app.engine('html', template);
// 2.2 配置前台的静态资源
app.use('/assets/', express.static(__dirname + '/view/home/assets/'));
app.use('/uploads/', express.static(__dirname + '/view/home/uploads/'));
// 2.3 配置后台的静态资源
app.use('/admin/*assets/', express.static(__dirname + '/view/admin/assets/'));
app.use('/upload/', express.static(__dirname + '/upload/'));
// 2.4 配置session
app.use(session({
    secret: 'wertyui45678',
    resave: true,
    saveUninitialized: true
}));
// 2.5配置bodyPaeser
app.use(bodyParser.urlencoded({
    extended: false
}));
// 2.6定义项目的根目录
global.rootPath = __dirname;
// 3.判断是否登录
app.use((req, res, next) => {
    // 判断是否登录，如果登录，直接next；
    // 如果没有登录，提示，跳转到登录页面
    if (req.session.isLogin || req.url === '/admin/login.html' || req.url === '/api/login/checkLogin') {
        next();
    } else {
        res.send('<script>alert("请先登录"); location.href="/admin/login.html";</script>');
        return;
    }
});
app.use(require(__dirname + '/router/home'));
app.use(require(__dirname + '/router/admin'));
app.use(require(__dirname + '/router/admin_cate'));
app.use(require(__dirname + '/router/admin_post'));
app.use(require(__dirname + '/router/admin_user'));
app.use(require(__dirname + '/router/admin_other'));
app.use(require(__dirname + '/router/admin_comment'));
// 加载接口
app.use(require(rootPath + '/接口/api'));