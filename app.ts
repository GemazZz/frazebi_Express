import { Request, Response } from "express";
import { getDataFunc } from "./helpers";
import { adminCheck, authorization } from "./middleware";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
require("./db");
const express = require("express");
const app = express();
const cors = require("cors");
const corsOpt = {
  origin: ["http://localhost:5173"],
  credentials: true,
};

app.use(cors(corsOpt));
app.use(express.json());

const Permanent_Phrases = require("./models/Permanent_Phrases.models");
const Temporary_Phrases = require("./models/temporary_Phrases.models");
const User = require("./models/User.models");

//User
app.post("/api/v1/signup", async (req: Request, res: Response) => {
  const { name, surname, email, password } = req.body;
  const foundUser = await User.findOne({ email: email });
  if (foundUser) {
    return res.status(400).json({ err: "Email is in use!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name: name,
    surname: surname,
    email: email,
    password: hashedPassword,
    role: "user",
    favorites: [],
    created_at: getDataFunc(),
  });

  await newUser.save();

  res.status(200).json({ message: "Added!" });
});

app.post("/api/v1/signin", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const foundUser = await User.findOne({ email: email });
  if (!foundUser) {
    return res.status(400).json({ err: "User does not Exist!" });
  }
  const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ err: "Wrong Credentials" });
  }
  const userId = foundUser._id;
  const token = jwt.sign({ userId }, process.env.secretKey, { expiresIn: "5h" });
  res.status(200).json({ token: token });
});

app.post("/api/v1/temporary_Phrases", authorization, async (req: Request, res: Response) => {
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

app.get("/api/v1/temporary_Phrases/:page", adminCheck, async (req: Request, res: Response) => {
  const { page } = req.params;
  const temporaryPhrase = await Temporary_Phrases.find().skip(page).limit(5);
  res.status(200).json(temporaryPhrase);
});

const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.listen(port, () => {
  console.log("Server Started Successfully, Waiting for MongoDB...");
});
