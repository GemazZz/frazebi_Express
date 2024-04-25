import mongoose, { Model, Schema } from "mongoose";
import { PhraseProps } from "../props";

const PermanentPhrasesSchema: Schema = new Schema({
  category: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: String, required: true },
});

PermanentPhrasesSchema.index({ content: "text", author: "text" });

const Permanent_Phrases: Model<PhraseProps> = mongoose.model<PhraseProps>("permanent_phrases", PermanentPhrasesSchema);

export default Permanent_Phrases;
