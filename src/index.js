import express from 'express'
import { PORT } from './config/serverConfig.js'
import { StatusCodes } from 'http-status-codes'
import connectDB from './config/dbConfig.js';

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/ping', (req, res) => {
  return res.status(StatusCodes.OK).json({ message: 'pong' })
})

app.listen(PORT, () => {
  connectDB();
  console.log(`app running on port: ${PORT}`);
})
