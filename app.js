const url = require('url');
const ws = require('ws');
const Cookies = require('cookies');

// koa2 导入的是class,所以用大写的Koa
const Koa = require('koa');
const fs = require('fs');
const cors = require('koa-cors'); // CORS跨域
// 解析post请求的request.body
const bodyParser = require('koa-bodyparser');
const controllers = require('./controllers');

const templating = require('./templating');
const WebSocketServer = ws.Server;

// 创建一个koa对象表示web app本身
const app = new Koa();
// 要用在router之前。否则无效
app.use(cors()); 

// 打印访问路径
app.use(async (ctx, next) => {
    console.log(`${ctx.request.method} ${ctx.request.url}`);
    await next(); // 调用下一个middleware
})

// parse user from cookies
app.use(async (ctx, next) => {
    ctx.state.user = parseUser(ctx.cookies.get('name') || '');
    await next();
});

// static file support
let staticFiles = require('./static-files');
app.use(staticFiles('/static/', __dirname + '/static'));

// 注册bodyParse在注册router.get(),router.post()之前，否则无法解析body
app.use(bodyParser());

// add numjucks as view
app.use(templating('views', {
    onCache: true,
    watch: true
}));

// 接口
app.use(controllers());

let server = app.listen(3000);

function parseUser(obj) {
    if (!obj) {
        return;
    }
    console.log('try parse:', obj);
    let s = '';
    if (typeof obj === 'string') {
        s = obj;
    } else if (obj.headers) {
        let cookies = new Cookies(obj, null);
        s = cookies.get('name');
    }

    if (s) {
        try {
            let user = JSON.parse(Buffer.from(s, 'base64').toString())
            console.log(`User:${user.name}, ID:${user.id}`);
            return user;
        } catch (e) {
            // ignore
        }
    }
}

// websocket
function createWebSocketServer(server, onConnection, onMessage, onClose, onError) {
    let wss = new WebSocketServer({
        server:server
    });
    //广播:对于聊天应用来说，每收到一条消息，就需要把该消息广播到所有WebSocket连接上。
    wss.broadcast = function broadcast(data) {
        wss.clients.forEach(function each(client) {
            client.send(data);
        });
    };
    // 已建立链接
    onConnection = onConnection || function () {
        console.log('[WebSocket] connected.');
    }
    // 接收到消息
    onMessage = onMessage || function (msg) {
        console.log('[WebSocket] message received:' + msg);
    };
    // 连接关闭
    onClose = onClose || function (code, message) {
        console.log(`[WebSocket] closed:${code}-${messahe}`);
    };
    // 出现错误
    onError = onError || function (err) {
        console.log('[WebSocket] error:' + err);
    };
    wss.on('connection', function(ws) {
        let location = url.parse(ws.upgradeReq.url, true);
        console.log('[WebSocketServer] connection:' + location.href);
        ws.on('message', onMessage);
        ws.on('close', onClose);
        ws.on('error', onError);
        if (location.pathname !== '/ws/chat') {
            // close ws
            ws.close(4000, 'Invalid URL');
        }
        // check user:
        let user = parseUser(ws.upgradeReq);
        if (!user) {
            ws.close(4001, 'Invalid user');
        }
        ws.user = user;
        ws.wss = wss;
        onConnection.apply(ws);
    });
    console.log('WebSocketServer was attached'); // websocket已连接
    return wss;
}

let messageIndex = 0;
// 创建消息字符串
function createMessage(type, user, data) {
    messageIndex++;
    return JSON.stringify({
        id: messageIndex,
        type: type,
        user: user,
        data: data
    });
}
function onConnect(){
    let user = this.user;
    let msg = createMessage('join', user, `${user.name} joined.`);
    this.wss.broadcast(msg); // 广播msg
    // build user list
    let users = this.wss.clients.map((client) => {
        return client.user;
    });
    this.send(createMessage('list', user, users));
}

function onMessage(message){
    console.log(message);
    if (message && message.trim()) {
        let msg = createMessage('chat', this.user, message.trim());
        this.wss.broadcast(msg);
    }
}

function onClose(){
    let user = this.user;
    let msg = createMessage('left', user, `${user.name} is left.`);
    this.wss.broadcast(msg);
}
app.wss = createWebSocketServer(server, onConnect, onMessage, onClose);
console.log('app started at port 3000.');