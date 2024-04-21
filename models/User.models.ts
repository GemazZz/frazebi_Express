import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  favorites: { type: Array, required: true },
  created_at: { type: String, required: true },
});

module.exports = mongoose.model("User", UsersSchema);
