import express from 'express'
import { PORT } from './config/serverConfig.js'
import connectDB from './config/dbConfig.js';
import apiRouter from './routes/apiRouter.js'
import pingRoute from './routes/pingRoute.js'
import bullServerAdapator from './config/bullBoardConfig.js';

import { createServer } from 'node:http';
import { Server } from 'socket.io';
const app = express()
const server = createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/ui',bullServerAdapator.getRouter());
app.use('/api',apiRouter);
app.use('/ping',pingRoute)

io.on('connection', (socket) => {
  console.log('a user connected',socket.id);
  socket.on('messageFromClient',(data)=>{
    io.emit('serverMessageBrodcast',data.toUpperCase());
  })
});

server.listen(PORT, async() => {
  connectDB();
  console.log(`app running on port: ${PORT}`);
})
