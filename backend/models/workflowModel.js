import mongoose from "mongoose";

const workflowSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "start", "complete"], default: "pending" },
  tasks: [
    {
      name: { type: String, required: true },
      role: { type: String, enum: ["admin", "manager", "worker"], required: true }
    }
  ]
});

const Workflow = mongoose.model("Workflow", workflowSchema);
export default Workflow;
