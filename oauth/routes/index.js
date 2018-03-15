const router = require('koa-router')();
// const home = require('./home')
// 中间件 koa async 函数
// /home 路由中间件
const home = require('./home');
const github = require('./github');
router.use('/home', home.routes(), home.allowedMethods())
router.use('/github', github.routes(), home.allowedMethods())

module.exports = router