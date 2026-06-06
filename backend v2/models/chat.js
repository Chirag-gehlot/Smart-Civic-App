import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: "New Chat",
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// We have done indexing so that we can retreive data quicker
chatSchema.index({ _id: 1, userId: 1 });

export default mongoose.model("Chat", chatSchema);
