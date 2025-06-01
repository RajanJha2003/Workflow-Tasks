import mongoose from "mongoose";
const taskSchema = new mongoose.Schema({
  workflow: { type: mongoose.Schema.Types.ObjectId, ref: "Workflow" },
  name: String,
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  status: { type: String, enum: ["pending", "complete"], default: "pending" },
  order: Number,
  completedAt: { type: Date, default: null }
});

const Task = mongoose.model("Task", taskSchema);
export default Task;