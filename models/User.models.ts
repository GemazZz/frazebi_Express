import mongoose, { Model, Schema } from "mongoose";
import { UserProps } from "../props";

const UsersSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "user", required: true },
  favorites: { type: Array, default: [], required: true },
  created_at: { type: String, required: true },
});

const User: Model<UserProps> = mongoose.model<UserProps>("User", UsersSchema);

export default User;
