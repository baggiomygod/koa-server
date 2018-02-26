const signin = async (ctx, next) => {
    let name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    console.log(`登陆：${name}, ${password}`);
    if (name === 'fan1130' && password === '1') {
        ctx.response.body = `<h1>welcome ${name}</h1>`;
        ctx.response.set('Set-Cookie', [`username=${name};Path=/;Expires=Tue, 15 Mar 2018 21:47:38 GMT;Domain=localhost:8080`, 'status=on']);
    } else {
        ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/">Try again</a></p>`;
    }
}

module.exports = {
    'POST /signin': signin,
}