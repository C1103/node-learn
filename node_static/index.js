// node 核心模块
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const mime = require('mime');
const handlebars = require('handlebars');

const server = http.createServer();
server.on('request', request.bind(this));

function request(req, res) {
  const { pathname } = url.parse(req.url);
  let filePath = path.join(config.root, pathname);
  if (pathname === '/') {
    const filePath = path.join(config.root, 'index.html');
    console.log(filePath);
    // 文件类型 text/html png text/css mime 
    // header http 响应头 状态码，响应体
    console.log(mime.getType(filePath))
    res.setHeader('Content-Type', mime.getType(filePath)+';charset=utf-8')
    return fs.createReadStream(filePath)
    .pipe(res)
  } else {
    res.setHeader('Content-Type', mime.getType(filePath)+';charset=utf-8')
    return fs.createReadStream(filePath)
    .pipe(res)
  }
  
  // 文件或目录 
  // 文件系统 接口处理
  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.end('not found');
      return ;
    }
    if (stats.isDirectory()) {
      console.log('目录');
      // 得到所有文件
      // 阻塞 异步 无阻塞 node
      let files = fs.readdirSync(filePath);
      console.log(files);
      files = files.map(file => ({
        name: file,
        url: path.join(pathname, file)
      }))
      // list 函数返回complie之后的模板
      let html = list()({
        title: pathname,
        files
      });
      res.setHeader('Content-Type', 'text/html');
      res.end(html);
      // console.log(files);
    }
  })
  
  function list() {
    let tmpl = fs.readFileSync(path.resolve(__dirname, 'template', 'list.html'), 'utf-8')
    return handlebars.compile(tmpl);
  }
  // const = url.paese(req.url);
  // / => index.html
  // 识别出/ path 
  // js DOM Global
  // // http://localhost:3000/a/index.html?a=c
  // /images/a.png 
  // /template/*.html
}

server.listen(3000, () => {
  console.log(`静态文件服务器启动成功，访问localhost:${config.port}`);
})