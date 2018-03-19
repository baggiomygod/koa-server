const IO = require('koa-socket');
const co = require('co');


const io = new IO({
    namespace: 'node-socket',
    ioOptions:{
        path: 'fuiapi/websocket'
    }
});

const TIME = 3000; //定时想服务器发送笑死
let TimerId = null;

const initIO = function (app){
    io.use(co.wrap(function* (ctx, next) {
        let start = new Date();
        yield next();
        console.log(`response time: ${new Date - start}ms`);
        })
    );
    
    // on: 已连接，连接成功
    io.on('connection', () => {
        console.log('successfully connect websocket!');
    });
    
    
    // 监控客户端发来的消息
    io.on('messageClient', (ctx, data) => {
        console.log('来自客户端的消息');
        console.log(data);
    });

    io.attach(app);
    sendToClient();
}

// 定时想客户端推送消息
function sendToClient(){
    TimerId = setInterval(() => {
        io.broadcast(
            'stockchallenge',
            {'userNum': parseInt(Math.random()*100) }
        );
    }, TIME);
}

module.exports = initIO;


