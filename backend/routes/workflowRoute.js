import express from "express";
import {
  createWorkflow,
  startWorkflow,
  assignTask,
  completeTask,
  getMyTasks,
  getMyWorkflows,
  getTasksForWorkflow,
  getAllUsers,
} from "../controllers/workflowController.js";
import { isAdmin, isAuth } from "../middleware/isAuth.js";

const workflowRouter = express.Router();

workflowRouter.post("/workflows", isAuth,isAdmin,createWorkflow);

workflowRouter.post("/workflows/start/:workflowId", isAuth,isAdmin,startWorkflow);

workflowRouter.post("/tasks/assign", isAuth,isAdmin,assignTask);

workflowRouter.post("/tasks/complete/:taskId", isAuth,completeTask);

workflowRouter.get("/tasks/my", isAuth,getMyTasks);

workflowRouter.get("/workflows/my",isAuth,isAdmin,getMyWorkflows)


workflowRouter.get("/tasks/:workflowId",isAuth,isAdmin,getTasksForWorkflow)


workflowRouter.get("/users",isAuth,isAdmin,getAllUsers)
export default workflowRouter;
