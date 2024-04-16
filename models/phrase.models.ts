const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const PhraseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // category: { type: String, required: true },
  // amount: { type: Number, required: true },
  // isFavorite: { type: Boolean, required: true },
  // date: { type: String, required: true },
});

module.exports = mongoose.model("Phrase", PhraseSchema);
