import { Request, Response } from "express";
import { getDataFunc } from "./helpers";
import { adminCheck, authorization } from "./middleware";
import { AuthenticatedRequest, PhraseProps, SignInProps, UserProps } from "./props";
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

import User from "./models/User.models";
import Temporary_Phrases from "./models/Temporary_Phrases.models";
import Permanent_Phrases from "./models/Permanent_Phrases.models";

//User
app.post("/api/v1/signup", async (req: Request, res: Response) => {
  const { name, surname, email, password }: UserProps = req.body;
  const foundUser: UserProps | null = await User.findOne({ email: email });
  if (foundUser) {
    return res.status(400).json({ err: "Email is in use!" });
  }

  const hashedPassword: string = await bcrypt.hash(password, 10);
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
  const { email, password }: SignInProps = req.body;
  const foundUser: UserProps | null = await User.findOne({ email: email });
  if (!foundUser) {
    return res.status(400).json({ err: "User does not Exist!" });
  }
  const isPasswordCorrect: boolean = await bcrypt.compare(password, foundUser.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ err: "Wrong Credentials" });
  }
  const userId: string = foundUser._id;
  const token = jwt.sign({ userId }, process.env.secretKey, { expiresIn: "5h" });

  res.status(200).json({ token: token });
});

app.post("/api/v1/temporary_Phrases", authorization, async (req: Request, res: Response) => {
  const { category, content, author }: PhraseProps = req.body;
  const newPhrase: PhraseProps = new Temporary_Phrases({ category: category, content: content, author: author, date: getDataFunc() });

  await newPhrase.save();

  res.status(200).json({ message: "Added!" });
});

app.post("/api/v1/Permanent_Phrases/:phraseId", adminCheck, async (req: Request, res: Response) => {
  const { phraseId } = req.params;
  const temporaryPhrase: PhraseProps | null = await Temporary_Phrases.findOne({ _id: phraseId });

  if (temporaryPhrase === null) {
    res.status(404).json({ message: "Temporary phrase not found!" });
  } else {
    const permanentPhrase: PhraseProps = new Permanent_Phrases({
      category: temporaryPhrase.category,
      content: temporaryPhrase.content,
      author: temporaryPhrase.author,
      date: temporaryPhrase.date,
    });

    await Temporary_Phrases.deleteOne({ _id: phraseId });
    await permanentPhrase.save();
    res.status(200).json({ message: "Added!" });
  }
});

app.get("/api/v1/temporary_Phrases/:page", adminCheck, async (req: Request, res: Response) => {
  const page: number = parseInt(req.params.page);
  const skip: number = (page - 1) * 5;
  const temporaryPhrase: PhraseProps[] = await Temporary_Phrases.find().skip(skip).limit(5);
  res.status(200).json(temporaryPhrase);
});

app.post("/api/v1/home", authorization, async (req: Request, res: Response) => {
  res.status(200).json("authorized");
});

app.post("/api/v1/favorite/:phraseId", authorization, async (req: AuthenticatedRequest, res: Response) => {
  const { phraseId } = req.params;
  const { userId } = req.user;
  const user: UserProps | null = await User.findOne({ _id: userId });
  if (user?.favorites.includes(phraseId)) {
    const updateFavArr: string[] = user.favorites.filter((phrase) => phrase !== phraseId);
    await User.updateOne({ _id: userId }, { favorites: updateFavArr });
    res.status(200).json({ message: "removed" });
  } else {
    user && (await User.updateOne({ _id: userId }, { favorites: [...user.favorites, phraseId] }));
    res.status(200).json({ message: "added" });
  }
});

app.get("/api/v1/home/:page", async (req: Request, res: Response) => {
  const page: number = parseInt(req.params.page);
  const skip: number = (page - 1) * 5;
  const permanentPhrase: PhraseProps[] = await Permanent_Phrases.find().skip(skip).limit(5);
  res.status(200).json(permanentPhrase);
});

app.get("/api/v1/search", async (req: Request, res: Response) => {
  const { searchWords }: { searchWords: string } = req.body;
  const outcome: PhraseProps[] = await Permanent_Phrases.find({ $text: { $search: searchWords } });
  res.status(200).json(outcome);
});

const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.listen(port, () => {
  console.log("Server Started Successfully, Waiting for MongoDB...");
});
