import mongoose from "mongoose";

// TokenCount is LLM model's currency where the query is not measured in no of words rather tokens used
const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    parentMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    tokenCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Index for fast pagination & chat history loading
 * -1 and 1 is for descending and ascending
 */

messageSchema.index({ chatId: 1, createdAt: -1 });

export default mongoose.model("Message", messageSchema);
