import Task from "../models/taskModel.js";
import Workflow from "../models/workflowModel.js";
import { assignTaskToManager } from "../utils/taskUtils.js";



// export const assignTask=async(req,res)=>{
//     try {
//         const {assigneeId,taskId}=req.body;
//         if(!assigneeId || !taskId){
//             return res.status(400).json({message:"Assignee ID and Task ID are required"});
//         }

//         const task=await Task.findById(taskId);
//         if(!task){
//             return res.status(404).json({message:"Task not found"});
//         }
//         if(task.status!=="pending"){
//             return res.status(400).json({message:"Task is already  completed"});
//         }

//         const managers=await User.find({role:"manager"});

//         if(!managers || managers.length===0){
//             return res.status(404).json({message:"No managers found to assign task"});
//         }

//         let selectedManager=null;
//         let minTasks=Infinity;

//         for(const manager of managers){

//             const taskCount=await Task.countDocuments({assignee:manager._id, status:"pending"});
//             if(taskCount < minTasks){
//                 minTasks=taskCount;
//                 selectedManager=manager;
//             }


//         }

//         task.assignee=selectedManager._id;
//         await task.save();
//         res.status(200).json({message:"Task assigned successfully",task});
        
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal Server Error" });
        
//     }

// }


export const completeTask=async(req,res)=>{
    try {
        const {taskId}=req.params;
        if(!taskId){
            return res.status(400).json({message:"Task ID is required"});
        }

        const task=await Task.findById(taskId);
        if(!task){
            returnres.status(404).json({
                message:"Task not found"
            })
        }

        if(task.status!=="pending"){
            return res.status(400).json({message:"Task is already completed"});
        }

       if(task.order>1){
         const previousTask=await Task.findOne({
            workflow:task.workflow,
            order:task.order-1
        })

        if(!previousTask || previousTask.status!=="complete"){
            return res.status(400).json({message:"Previous task is not completed"});
        }
       }
        task.status="complete";
        task.completedAt=new Date();
        await task.save();

        const workflow=await Workflow.findById(task.workflow);
        if(!workflow){
            return res.status(404).json({message:"Workflow not found"});
        }

        const nextTask=workflow.tasks[task.order];
        if(nextTask){
            const newTask=new Task({
                workflow:task.workflow,
                name:nextTask.name,
                order:task.order+1
            });
            await newTask.save();

            const freshTask=await Task.findById(newTask._id);

            await assignTaskToManager(freshTask);

            res.status(200).json({message:"Task completed successfully",task:newTask});
        }else{
            workflow.status="complete";
            await workflow.save();
            res.status(200).json({message:"Workflow completed successfully",task});
        }

        

        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
        
    }


}


export const getMyTasks=async(req,res)=>{
    try {

        const userId=req.userId;


        const tasks=await Task.find({assignee:userId});
        if(!tasks || tasks.length===0){
            return res.status(404).json({message:"No tasks found for this user"});
        }
        res.status(200).json({message:"Tasks fetched successfully",tasks});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
        
    }


}


export const getTasksForWorkflow=async(req,res)=>{

    try {

        const {workflowId}=req.params;


        const tasks=await Task.find({workflow:workflowId});

        if(!tasks || tasks.length===0){
            return res.status(404).json({message:"No tasks found for this workflow"});
        }
        res.status(200).json({message:"Tasks fetched successfully",tasks});

        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
        
    }


}