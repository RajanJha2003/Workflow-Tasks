import express from 'express';


const taskRouter = express.Router();

taskRouter.post("/tasks/assign", isAuth,isAdmin,assignTask);

taskRouter.post("/tasks/complete/:taskId", isAuth,completeTask);

taskRouter.get("/tasks/my", isAuth,getMyTasks);

taskRouter.get("/tasks/:workflowId",isAuth,isAdmin,getTasksForWorkflow)




export default taskRouter;