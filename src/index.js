import express from 'express'
import { PORT } from './config/serverConfig.js'
import connectDB from './config/dbConfig.js';
import apiRouter from './routes/apiRouter.js'
import pingRoute from './routes/pingRoute.js'

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api',apiRouter);
app.use('/ping',pingRoute)

app.listen(PORT, () => {
  connectDB();
  console.log(`app running on port: ${PORT}`);
})
