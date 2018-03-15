const path = require('path')
const Koa = require('koa');
const views = require('koa-views');
const app = new Koa();
const routers = require('./routes/index')
const fs = require('fs')
// 一堆中间件， 一个做完之后， 如果不返回 next =>
// 未来确保中间件的执行顺序 异步的中间件函数同步化
const main = async (ctx) => {
  // ctx.response.body = 'hello word'
  ctx.response.type = 'html'
  ctx.response.body = await fs.readFileSync('./template.html', 'utf-8')
};
app.use(main)
// middleware
// app.use(views(path.join(__dirname, '/view'), {
//   extension: 'ejs'
// }));
// app.use(routers.routes()).use(
//   routers.allowedMethods()
// )
app.listen(3000);
console.log('The Server is on port 3000')