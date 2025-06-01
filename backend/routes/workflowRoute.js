import express from "express";
import {
  createWorkflow,
  startWorkflow,
  
  getMyWorkflows,
  
} from "../controllers/workflowController.js";
import { isAdmin, isAuth } from "../middleware/isAuth.js";

const workflowRouter = express.Router();

workflowRouter.post("/workflows", isAuth,isAdmin,createWorkflow);

workflowRouter.post("/workflows/start/:workflowId", isAuth,isAdmin,startWorkflow);



workflowRouter.get("/workflows/my",isAuth,isAdmin,getMyWorkflows)




export default workflowRouter;
