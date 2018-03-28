// const signin = async (ctx, next) => {
//     let name = ctx.request.body.name || '',
//         password = ctx.request.body.password || '';
//     console.log(`登陆：${name}, ${password}`);
//     if (name === 'fan1130' && password === '1') {
//         ctx.response.body = `<h1>welcome ${name}</h1>`;
//         ctx.response.set('Set-Cookie', [`username=${name};Path=/;Expires=Tue, 15 Mar 2018 21:47:38 GMT;Domain=localhost:8080`, 'status=on']);
//     } else {
//         ctx.response.body = `<h1>Login failed!</h1>
//         <p><a href="/">Try again</a></p>`;
//     }
// }
let index = 0;
const signin = async (ctx, next) => {
    let names = '甲乙丙丁戊己庚辛壬癸';
    let name = names[index % 10];
    ctx.render('signin.html', {
        name: `用户${name}`
    });
}
const postSignin = async (ctx, next) => {
    index++;
    let name = ctx.request.body.name || '用户甲';
    let user = {
        id: index,
        name: name,
        image: index % 10
    };
    let value = Buffer.from(JSON.stringify(user).toString('base64'));
    console.log(`Set cookie value:${value}`);
    ctx.cookies.set('name', value);
    ctx.response.redirect('/');
}
const signout = async (ctx, next) => {
    ctx.cookies.set('name', '');
    ctx.response.redirect('/signin');
}
module.exports = {
    'GET /signin': signin,
    'POST /signin': postSignin,
    'GET /signout': signout
}