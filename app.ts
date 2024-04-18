import { Request, Response } from "express";
const express = require("express");
require("dotenv").config();
require("./db");
const app = express();

// const cors = require("cors");
// const corsOpt = {
//   origin: ["https://budget-app-gemazzz.netlify.app", "https://budget-app-gemazzz.vercel.app"],
// };
// app.use(cors(corsOpt));
app.use(express.json());

const Permanent_Phrases = require("./models/Permanent_Phrases.models");
const Temporary_Phrases = require("./models/temporary_Phrases.models");

app.post("/api/v1/name", async (req: Request, res: Response) => {
  const { category, content, author } = req.body;
  const newUser = new Permanent_Phrases();
  newUser.category = category;
  newUser.content = content;
  newUser.author = author;
  newUser.date = new Date();

  await newUser.save();

  res.status(200).json({ message: "Added!" });
});

const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.listen(port, () => {
  console.log("Server Started Successfully, Waiting for MongoDB...");
});
