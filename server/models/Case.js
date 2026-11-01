import mongoose from "mongoose";

const suspectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const clueSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    discovered: { type: Boolean, default: false },
  },
  { _id: false }
);

const hintSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    used: { type: Boolean, default: false },
  },
  { _id: false }
);

const caseSchema = new mongoose.Schema(
  {
    premise: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 500,
    },

    title: {
      type: String,
      required: true,
    },

    story: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    suspects: {
      type: [suspectSchema],
      required: true,
    },

    clues: {
      type: [clueSchema],
      required: true,
    },

    hints: {
      type: [hintSchema],
      required: true,
    },

    culpritId: {
      type: String,
      required: true,
      select: false,
    },

    solution: {
      type: String,
      required: true,
      select: false,
    },

    accusation: {
      suspectId: {
        type: String,
        default: null,
      },
      correct: {
        type: Boolean,
        default: null,
      },
    },

    score: {
      type: Number,
      default: null,
      min: 0,
    },

    status: {
      type: String,
      enum: ["active", "solved"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Case = mongoose.model("Case", caseSchema);

export default Case;