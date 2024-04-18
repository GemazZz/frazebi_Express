import mongoose from "mongoose";

const Temporary_Phrases = new mongoose.Schema({
  userId: { type: Number, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: String, required: true },
});

module.exports = mongoose.model("temporary_Phrases", Temporary_Phrases);
