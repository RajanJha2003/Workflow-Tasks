import express from 'express';
import connectDB from './database/db.js';
import dotenv from 'dotenv';
import cors from 'cors';

import cookieParser from 'cookie-parser';
import userRouter from './routes/userRoute.js';
import workflowRouter from './routes/workflowRoute.js';
import taskRouter from './routes/taskRoute.js';


dotenv.config();


const app=express();

app.use(express.json());
app.use(cors({
    origin:["http://localhost:5173"],
    credentials:true
}));

app.use(cookieParser());


connectDB();


app.use("/api/user",userRouter)

app.use("/api/workflow",workflowRouter)

app.use("/api/tasks",taskRouter);






app.listen(5000,()=>{
    console.log(`Server running on port 5000`)
})