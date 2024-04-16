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

const Phrase = require("./models/phrase.models");

app.post("/api/v1/name", async (req: Request, res: Response) => {
  const { name } = req.body;
  const newUser = new Phrase();
  newUser.name = name;

  await newUser.save();

  res.status(200).json({ message: "Added!" });
});

const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.listen(port, () => {
  console.log("Server Started Successfully, Waiting for MongoDB...");
});
