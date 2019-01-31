const Koa = require('koa');

//const serve = require('koa-static');
const app = new Koa();

const server = require('http').createServer(app.callback());

const io = require('socket.io')(server);

const bodyParser = require('koa-bodyparser');

const router = require('koa-router')();

const main = require('./router/main');

const PORT = process.env.PORT || '5000';


router.use('/', main.routes());

//app.use(serve(__dirname + '/client/build'));

app.use(bodyParser());

app.use(router.routes());

const messageList = [];

// socket连接
io.on('connection', (socket) => {
    socket.on('LOGIN', (msg) => {
        console.log('a user connected: ' + msg);
        io.emit('LOGIN', msg);
        io.emit('INIT', messageList);
    });
    socket.on('UPDATA_MESSAGE', (msg) => {
        const item = {...msg,key:'im'+new Date().valueOf()}
        messageList.push(item);
        io.emit('UPDATA_MESSAGE', item);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(PORT);