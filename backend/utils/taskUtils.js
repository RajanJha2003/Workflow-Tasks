
import User from '../models/userModel.js';
import Task from '../models/taskModel.js';

export const assignTaskToManager = async (task) => {
  try {
    const managers = await User.find({ role: "manager" });
    if (!managers || managers.length === 0) {
      console.warn("No managers available for task assignment.");
      return null;
    }

    let selectedManager = null;
    let minTasks = Infinity;

    for (const manager of managers) {
      const taskCount = await Task.countDocuments({ assignee: manager._id, status: "pending" });
      if (taskCount < minTasks) {
        minTasks = taskCount;
        selectedManager = manager;
      }
    }

    if (selectedManager) {
      task.assignee = selectedManager._id;
      await task.save();
      return selectedManager;
    }

    return null;
  } catch (err) {
    console.error( err);
    
  }
};
