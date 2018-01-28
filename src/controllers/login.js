const signin = async (ctx, next) => {
    console.log(ctx.request.body);
    let name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    console.log(`登陆：${name}, ${password}`);
    if (name === 'fan1130' && password === '1') {
        ctx.response.body = `<h1>welcome ${name}</h1>`;
    } else {
        ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/">Try again</a></p>`;
    }
}

module.exports = {
    'POST /signin': signin
}