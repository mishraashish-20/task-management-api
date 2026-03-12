import mongoose from "mongoose";

const TaskHistorySchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    by: { type: Number, required: true },
    at: { type: Date, default: Date.now },
    meta: { type: Object },
  },
  { _id: false },
);

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },

    assignedTo: { type: Number, required: true },
    createdBy: { type: Number, required: true },

    attachments: { type: [String], default: [] },
    history: { type: [TaskHistorySchema], default: [] },
    logs: { type: [String], default: [] },
  },
  { timestamps: true },
);

export const Task = mongoose.model("Task", TaskSchema);
