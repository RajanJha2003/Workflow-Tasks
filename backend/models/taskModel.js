import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  workflow: { type: mongoose.Schema.Types.ObjectId, ref: "Workflow", required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ["admin", "manager", "worker"], required: true },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  status: { type: String, enum: ["pending", "complete"], default: "pending" },
  order: { type: Number, required: true },
  completedAt: { type: Date, default: null }
});

const Task = mongoose.model("Task", taskSchema);
export default Task;
