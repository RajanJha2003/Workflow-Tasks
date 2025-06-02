import Task from "../models/taskModel.js";
import User from "../models/userModel.js";

export const assignTaskByRole = async (task, role) => {
  const users = await User.find({ role });
  if (!users || users.length === 0) {
      console.warn("No users found")  }

  let selectedUser = null;
  let minTasks = Infinity;

  for (const user of users) {
    const taskCount = await Task.countDocuments({ assignee: user._id, status: "pending" });
    if (taskCount < minTasks) {
      minTasks = taskCount;
      selectedUser = user;
    }
  }

  if (selectedUser) {
    task.assignee = selectedUser._id;
    await task.save();
    return selectedUser; 
  }

  return null; 
};
