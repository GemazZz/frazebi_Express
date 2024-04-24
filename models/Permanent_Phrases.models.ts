import mongoose, { Model, Schema } from "mongoose";
import { PhraseProps } from "../props";

const Permanent_Phrases: Schema = new Schema({
  category: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: String, required: true },
});

const Temporary_Phrases: Model<PhraseProps> = mongoose.model<PhraseProps>("permanent_phrases", Permanent_Phrases);

export default Temporary_Phrases;
