import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" }, 
  dueDate: { type: Date, default: null },
  subTasks: [
    {
      title: { type: String, required: true },
      description: { type: String },
      completed: { type: Boolean, default: false },
      subTasks: []
    }
  ],
  collectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Collection", required: true } ,// Belongs to a collection
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true } // Belongs to a acc
}, { timestamps: true });

export default mongoose.model("Task", TaskSchema);
