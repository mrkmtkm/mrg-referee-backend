const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const env = process.env;

app.use(
  cors({
    origin: 'http://localhost:8080', //アクセス許可するオリジン
    credentials: true, //レスポンスヘッダーにAccess-Control-Allow-Credentials追加
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//mongo DBの設定
const PORT = 4000;
const http = require('http');
const server = http.createServer(app);
const username = encodeURIComponent(env.USER_NAME);
const password = encodeURIComponent(env.PASSWORD);
const uri = `mongodb+srv://${username}:${password}@cluster0.sh2xik2.mongodb.net/?retryWrites=true&w=majority`;

const mongoose = require('mongoose');

mongoose.connect(uri);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'DB connection error:'));
db.once('open', () => console.log('DB connection successful'));

//ルーティング
const tournamentRouter = require('./routes/tournament');
const adminRouter = require('./routes/admin');
const resultRouter = require('./routes/result');
const refereeScoreRouter = require('./routes/referee_score');
app.use('/referee_score', refereeScoreRouter);
app.use('/tournament', tournamentRouter);
app.use('/admin', adminRouter);
app.use('/result', resultRouter);

//socket.io
const { Server } = require('socket.io');
const RefereeScore = require('./models/RefereeScore');

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:8080'],
    credentials: true,
  },
});

//クライアントと通信
io.on('connection', (socket) => {
  //クライアントから受信
  // socket.on('send_message', (data) => {
  //   console.log(data);
  //   //クライアントへ返信
  //   //io.emit('received_message', data);
  // });

  socket.on('send_referee', (data) => {
    //審判へ返信
    io.emit(data.tournamentId, data);
  });

  socket.on('send_admin', async (data) => {
    //管理者へ返信
    const score = new RefereeScore({
      result_id: data.resultId,
      referee_name: data.refereeName,
      execution: data.execution,
      difficulty: data.difficulty,
    });

    const saveScore = await score.save();
    // io.emit(data.resultId, data);
  });
});

server.listen(PORT, () => console.log(`server is running on ${PORT}`));
