import mongoose from "mongoose";

const Permanent_Phrases = new mongoose.Schema({
  category: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: String, required: true },
});

module.exports = mongoose.model("permanent_phrases", Permanent_Phrases);
