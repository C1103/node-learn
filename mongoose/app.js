const Koa = require('koa')
const app = new Koa()
const validation = require('./validation');
const mongoose = require('mongoose')
const mongoUrl = `mongodb://127.0.0.1:27017/vueblog`
const Schema = mongoose.Schema
// model 层抽像
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 8,
    index: true,
    unique: true
  },
  age: {
    type: Number,
    min: 18,
    max: 30,
    required: true
  },
  sex: {
    type: String,
    enum: {
      values: ['male', 'female'],
      message: '`${PATH}`是`${VALUE}`,您必须确认您的性别!'
    },
    required: true
  },
  phone: {
    type: String,
    validate: {
      validator: validation.phone,
      message: '`{PATH}` 必须是有效的11位手机号码!'
    },
    required: true
  }
})
mongoose.model('User', UserSchema)

const ArticleSchema = new Schema({
  title: {
    type: String,
    index: true
  },
  by:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})
mongoose.model('Article', ArticleSchema)

mongoose.Promise = global.Promise
mongoose.connection
  .openUri(mongoUrl)
  .once('open', async () => {
    console.log('database connect success')
  })
  .on('error', (error) => {
    console.wran('database connect fail',
     error)
  })
const main = async (ctx) => {
  // const id = ctx.req.id 

  // const ArticleModel = mongoose.model('Article')
  // try {
  //   const article = await ArticleModel.findById('5aab7b5db7a7f9fc8b7523d2')
  //   .populate('by')
  //   .exec()
  //   console.log(article);
  //   const str = `文章标题：${article.title},
  //   作者：${article.by.name }`
  //   ctx.body = str;
  // } catch(e) {
  //   console.log(e)
  //   ctx.body = '查询失败';
  // }
  

  const User  = mongoose.model('User')
  // // 新建一个user User类
  // // 内存中与Schema规则一致的对象 
  // 数据完整性 SchemaValidation
  const user = new User({
    name: '小花',
    age: 20,
    phone: '136722366759',
    sex: 'male'
  })
  
  // 接口存取是花时间的 IO 
  // 数据库读取， 文件读取， 网络请求
  
  try {
    await user.save()
    ctx.body = '保存成功'
  } catch(e) {
    // console.log(e);
    ctx.body = e.message
  }
  
  // 存进去
  
}
app.use(main)
app.listen(3000);
