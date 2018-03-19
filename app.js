// koa2 导入的是class,所以用大写的Koa
const Koa = require('koa');
const fs = require('fs');
const cors = require('koa-cors'); // CORS跨域
// const IO = require('koa-socket');
// const co = require('co');
const nodeSocket = require('./src/controllers/socket/socket');
// 解析post请求的request.body
const bodyParser = require('koa-bodyparser');
const controllers = require('./controllers');

// 创建一个koa对象表示web app本身
const app = new Koa();
app.use(cors()); // 也要用在router之前。否则无效

// 打印访问路径
app.use(async (ctx, next) => {
    console.log(`${ctx.request.method} ${ctx.request.url}`);
    await next(); // 调用下一个middleware
})
// 注册bodyParse在注册router.get(),router.post()之前，否则无法解析body
app.use(bodyParser());

// 接口
app.use(controllers());

// websocket
nodeSocket(app);
// app.use(nodeSocket(app));

app.listen(3000);
console.log('app started at port 3000.');