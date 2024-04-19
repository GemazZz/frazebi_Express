import { Request, Response } from "express";
import { getDataFunc } from "./helpers";
require("dotenv").config();
require("./db");
const express = require("express");
const app = express();
const cors = require("cors");
const corsOpt = {
  origin: ["https://budget-app-gemazzz.netlify.app", "https://budget-app-gemazzz.vercel.app"],
};

app.use(cors(corsOpt));
app.use(express.json());

const Permanent_Phrases = require("./models/Permanent_Phrases.models");
const Temporary_Phrases = require("./models/temporary_Phrases.models");

app.post("/api/v1/temporary_Phrases", async (req: Request, res: Response) => {
  const { category, content, author } = req.body;
  const newPhrase = new Temporary_Phrases({ category: category, content: content, author: author, date: getDataFunc() });

  await newPhrase.save();

  res.status(200).json({ message: "Added!" });
});

app.post("/api/v1/Permanent_Phrases", async (req: Request, res: Response) => {
  const { _id } = req.body;
  const temporaryPhrase = await Temporary_Phrases.findOne({ _id: _id });
  const permanentPhrase = new Permanent_Phrases({
    category: temporaryPhrase.category,
    content: temporaryPhrase.content,
    author: temporaryPhrase.author,
    date: temporaryPhrase.date,
  });

  await Temporary_Phrases.deleteOne({ _id: _id });
  await permanentPhrase.save();

  res.status(200).json({ message: "Added!" });
});

const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.listen(port, () => {
  console.log("Server Started Successfully, Waiting for MongoDB...");
});
