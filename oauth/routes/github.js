// oauth 协议为用户资源的授权提供了一个安全，开放又简单的标准
// oauth与授权不同的地方不会涉及第三方用户
// 的账号和密码，可以申请获得资源的授权
// 微信支付
const router = require('koa-router')()
const config = require('../config')
const fetch = require('node-fetch')
const routes = router
  .get('/login', async(ctx) => {
    // 去到github授权页
    const dataSrc =  (new Date()).valueOf();
    console.log(dataSrc)
    // 令牌环 access_token
    // guthub 会给我们授权 client_id
    // oauth 先去第三方网站注册应用
    // 应用上线地址 安全性 保证开发者权益
    // 一去请求授权，将结果返回到开发服务器
    // Authorization callback URL
    var path = `https://github.com/login/oauth/authorize?client_id=${config.client_id}&scope=${config.scope}&state${dataSrc}`
    // 重定向
    // 授权中间页
    ctx.redirect(path)
    // console.log()
  })
  .get('/oauth/callback', async(ctx) => {
    // code
    const code = ctx.query.code
    let path = `https://github.com/login/oauth/access_token`;
    const params = {
      client_id: config.client_id,
      client_secret: config.client_secret,
      code: code
    }
      // 网页请求
      await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
    .then(res => {
      console.log(res);
      // thenable 返回一个promise
      // 可以一直链下去
      return res.text()
    })
    .then(body => {
      console.log(body)
      const args = body.split('&');
      let arg = args[0].split('=');
      const access_token = arg[1];
      console.log(access_token);
      return access_token;
    })
    .then(async(token) => {
        const url = 'http://github.com/user?access_token=' + token
        console.log(url)
        await fetch(url).then(res => {
            return res.json()
        }).then(res => {
            console.log(res)
            ctx.body = res
        })
    })

  

  })
  module.exports = routes
