import mongoose, { Model, Schema } from "mongoose";
import { PhraseProps } from "../props";

const TemporaryPhrasesSchema: Schema = new Schema({
  category: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: String, required: true },
});

const Temporary_Phrases: Model<PhraseProps> = mongoose.model<PhraseProps>("Temporary_Phrases", TemporaryPhrasesSchema);

export default Temporary_Phrases;
