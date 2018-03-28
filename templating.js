const nunjucks = require('nunjucks');

function createEnv(path, opts){
    let 
        autoescape = !opts.autoescape ? true : opts.autoescape,
        onCache = opts.onCache || false,
        watch = opts.watch || false,
        throwOnUndefined = opts.throwOnUndefined || false,
        env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader(path, {
                onCache: onCache,
                watch: watch
            }), {
                autoescape: autoescape,
                throwOnUndefined: throwOnUndefined
            });
        if (opts.filters) {
            for (let f in opts.filters) {
                env.addFilter(f, opts.filters[f]);
            }
        }
        return env;
}

function templating(path, opts){
    let env = createEnv(path, opts);
    return async (ctx, next) => {
        ctx.render = function (view, model) {
            // 合并cyt.state, model
            ctx.response.body 
                = env.render(view, Object.assign({}, ctx.state || {}, model || {}));
            ctx.response.type = 'text/html';
        };
        await next();
    }
}

module.exports = templating;