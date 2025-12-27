import express from 'express'
import { PORT } from './config/serverConfig.js'
import connectDB from './config/dbConfig.js';
import apiRouter from './routes/apiRouter.js'
import pingRoute from './routes/pingRoute.js'
import bullServerAdapator from './config/bullBoardConfig.js';
import cors from 'cors';

import { createServer } from 'node:http';
import { Server } from 'socket.io';
import messageSocketHandler from './controllers/messageSocketController.js';
import channelSocketHandler from './controllers/channelSocketController.js'
const app = express()
const server = createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors())
app.use('/ui',bullServerAdapator.getRouter());
app.use('/api',apiRouter);
app.use('/ping',pingRoute)

io.on('connection', (socket) => {
  console.log('a user connected',socket.id);
  messageSocketHandler(io,socket);
  channelSocketHandler(io,socket);
});

server.listen(PORT, async() => {
  connectDB();
  console.log(`app running on port: ${PORT}`);
})
