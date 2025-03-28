import mongoose from "mongoose";

// Define the SubTaskSchema recursively to allow nested subtasks
const SubTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Add subTasks field to the schema itself to make it recursive
SubTaskSchema.add({
  subTasks: [SubTaskSchema]
});

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" }, 
  dueDate: { type: Date, default: null },
  subTasks: [SubTaskSchema],
  collectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Collection", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true }
}, { timestamps: true });

export default mongoose.model("Task", TaskSchema);
