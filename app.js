const express = require('express');
const app = express();
const cors = require('cors');

app.use(
  cors({
    origin: 'http://localhost:8080', //アクセス許可するオリジン
    credentials: true, //レスポンスヘッダーにAccess-Control-Allow-Credentials追加
  })
);
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const PORT = 4000;
const http = require('http');
const adminRouter = require('./routes/admin'); //追加
const server = http.createServer(app);
const username = encodeURIComponent('mrkmaui');
const password = encodeURIComponent('0mh2BthuSM3pAuYw');
const uri = `mongodb+srv://${username}:${password}@cluster0.sh2xik2.mongodb.net/?retryWrites=true&w=majority`;

const mongoose = require('mongoose');

mongoose.connect(uri);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'DB connection error:'));
db.once('open', () => console.log('DB connection successful'));

app.use('/admin', adminRouter);

const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:8080'],
    credentials: true,
  },
});
//test
app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

//クライアントと通信
io.on('connection', (socket) => {
  console.log('a user connected');

  //クライアントから受信
  socket.on('send_message', (data) => {
    console.log(data);
    //クライアントへ返信
    io.emit('received_message', data);
  });
});

server.listen(PORT, () => console.log(`server is running on ${PORT}`));
