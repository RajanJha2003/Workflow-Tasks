import Task from "../models/taskModel.js";
import Workflow from "../models/workflowModel.js";
import { assignTaskByRole } from "../utils/taskUtils.js";

export const createWorkflow = async (req, res) => {
  try {
    const { name, tasks } = req.body;
    const createdBy = req.userId;

    if (!name || !tasks || tasks.length === 0) {
      return res.status(400).json({ message: "Name and tasks are required" });
    }

    for (const task of tasks) {
      if (!task.name || !task.role) {
        return res.status(400).json({ message: "Each task must have a name and role" });
      }
    }

    const workflow = new Workflow({
      name,
      createdBy,
      tasks: tasks.map(task => ({
        name: task.name,
        role: task.role,
      }))
    });

    await workflow.save();
    res.status(201).json({ message: "Workflow created successfully", workflow });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const startWorkflow = async (req, res) => {
  try {
    const { workflowId } = req.params;
    const workflow = await Workflow.findById(workflowId);

    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    if (workflow.status !== "pending") {
      return res.status(400).json({ message: "Workflow is already started or completed" });
    }

    const first = workflow.tasks[0];
    if (!first) {
      return res.status(400).json({ message: "Workflow has no tasks to start" });
    }

    const task = new Task({
      workflow: workflow._id,
      name: first.name,
      role: first.role,
      order: 1
    });

    await task.save();

    await assignTaskByRole(task, first.role);

    workflow.status = "start";
    await workflow.save();

    res.status(200).json({ message: "Workflow started successfully", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMyWorkflows = async (req, res) => {
  try {
    const userId = req.userId;
    const workflows = await Workflow.find({ createdBy: userId });

    if (!workflows || workflows.length === 0) {
      return res.status(404).json({ message: "No workflows found" });
    }

    res.status(200).json({ message: "Workflows fetched successfully", workflows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
