const fs = require('fs');

// router.get().router.post
function addMapping(router, mapping) {
    for (let url in mapping) {
        if (url.startsWith('GET')) {
            let getPath = url.substring(4); // 'GET /'
            router.get(getPath, mapping[url]);
            console.log(`register URL mapping: GET ${getPath}`);
        } else if (url.startsWith('POST')){
            let postPath = url.substring(5); // 'POST /signin'
            router.post(postPath, mapping[url]);
            console.log(`register URL mapping: POST ${postPath}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}
function addControllers(router, dir){
    console.log(dir);
    const files = fs.readdirSync(__dirname + '/' + dir);
    let js_files = files.filter(f => {
        return f.endsWith('.js');
    });

    for (let file of js_files) {
        console.log(`peocess controller: ${file}...`);

        let mapping = require(__dirname + '/' + dir + '/' + file);
        addMapping(router, mapping);
    }
}

module.exports = function (dir) {
    let controller_dir = dir || 'src/controllers',
        router = require('koa-router')();
    addControllers(router, controller_dir);
    return router.routes();

}