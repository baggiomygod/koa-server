/**
 * 对于任何请求，app将调用该异步函数处理请求
 * ctx: koa传入的封装了request和reponse的变量，通过ctx访问resquest和response
 * next: 是koa传入的将要处理的下一个异步函数
 * 
 * async 标记的函数为异步函数，可以用await调用另一个异步函数
 */
// 打印URL
const consumingTime = async (ctx, next) => {
    const start = new Date().getTime();
    console.log('开始:');
    await next(); // 调用下一个middleware
    const ms = new Date().getTime() - start;
    console.log(`耗时:${ms}ms`);
}
const getHello = async (ctx, next) => {
    let name = ctx.params.name;
    ctx.response.body = `<h1>hello, ${name}</h1>`;
}
// const getIndex = async (ctx, next) => {
//     ctx.response.body = '<h1>index...</h1>';
// }

module.exports = {
    'GET /hello/:name': getHello,
    // 'GET /': getIndex
}