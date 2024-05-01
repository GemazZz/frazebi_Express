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
//Sign Up
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

  return res.status(200).json({ message: "Added!" });
});

//Sign In
app.post("/api/v1/signin", async (req: Request, res: Response) => {
  const { email, password }: SignInProps = req.body;
  if (!email || !password) {
    return res.status(400).json({ err: "Something Missing!" });
  }
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

  return res.status(200).json({ token: token });
});

//check if user is authorized
app.get("/api/v1/home/username", authorization, async (req: AuthenticatedRequest, res: Response) => {
  const { userId }: { userId: string } = req.user;
  const user: UserProps | null = await User.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({ err: "user not found" });
  } else {
    return res.status(200).json({ message: user.name });
  }
});

//user gets permanent phrases
app.get("/api/v1/home/:page", async (req: Request, res: Response) => {
  const page: number = parseInt(req.params.page);
  const skip: number = (page - 1) * 5;
  const permanentPhrase: PhraseProps[] = await Permanent_Phrases.find().skip(skip).limit(5);
  return res.status(200).json(permanentPhrase);
});

//user gets favorite phrases
app.get("/api/v1/favorite/:page", authorization, async (req: AuthenticatedRequest, res: Response) => {
  const { userId }: { userId: string } = req.user;
  const page: number = parseInt(req.params.page);
  const skip: number = (page - 1) * 5;
  const user: UserProps | null = await User.findOne({ _id: userId });
  if (!user) {
    return res.status(400).json({ err: "user not found!" });
  }
  const favArr: string[] | undefined = user?.favorites;
  const foundFavArr: PhraseProps[] = await Permanent_Phrases.find({ favArr }).skip(skip).limit(5);
  return res.status(200).json({ foundFavArr });
});

//user adds or deletes favorite phrases
app.post("/api/v1/favorite/:phraseId", authorization, async (req: AuthenticatedRequest, res: Response) => {
  const { phraseId }: { phraseId?: string } = req.params;
  const { userId }: { userId: string } = req.user;
  const user: UserProps | null = await User.findOne({ _id: userId });
  if (user?.favorites.includes(phraseId)) {
    const updateFavArr: string[] = user.favorites.filter((phrase) => phrase !== phraseId);
    await User.updateOne({ _id: userId }, { favorites: updateFavArr });
    return res.status(200).json({ message: "removed" });
  } else if (!user?.favorites.includes(phraseId)) {
    user && (await User.updateOne({ _id: userId }, { favorites: [...user.favorites, phraseId] }));
    return res.status(200).json({ message: "added" });
  } else {
    return res.status(400).json({ err: "Something Missing!" });
  }
});

//user sends new phrase
app.post("/api/v1/temporary_Phrases", authorization, async (req: Request, res: Response) => {
  const { category, content, author }: PhraseProps = req.body;
  if (!category || !content || !author) {
    return res.status(400).json({ err: "Something Missing!" });
  }
  const newPhrase: PhraseProps = new Temporary_Phrases({ category: category, content: content, author: author, date: getDataFunc() });

  await newPhrase.save();

  return res.status(200).json({ message: "Added!" });
});

//user search phrases
app.get("/api/v1/search", async (req: Request, res: Response) => {
  const { searchWords }: { searchWords: string } = req.body;
  const outcome: PhraseProps[] = await Permanent_Phrases.find({ $text: { $search: searchWords } });
  return res.status(200).json(outcome);
});

//admin adds or deletes phrase which was sent by client
app.post("/api/v1/Permanent_Phrases/:phraseId/:command", adminCheck, async (req: Request, res: Response) => {
  const { phraseId, command }: { phraseId?: string; command?: string } = req.params;
  const temporaryPhrase: PhraseProps | null = await Temporary_Phrases.findOne({ _id: phraseId });
  if (temporaryPhrase === null) {
    return res.status(404).json({ message: "Temporary phrase not found!" });
  } else if (command === "add") {
    const permanentPhrase: PhraseProps = new Permanent_Phrases({
      category: temporaryPhrase.category,
      content: temporaryPhrase.content,
      author: temporaryPhrase.author,
      date: temporaryPhrase.date,
    });

    await Temporary_Phrases.deleteOne({ _id: phraseId });
    await permanentPhrase.save();
    return res.status(200).json({ message: "Added!" });
  } else if (command === "delete") {
    await Temporary_Phrases.deleteOne({ _id: phraseId });
    return res.status(200).json({ message: "Deleted!" });
  }
});

//admin gets temporary phrases
app.get("/api/v1/temporary_Phrases/:page", adminCheck, async (req: Request, res: Response) => {
  const page: number = parseInt(req.params.page);
  const skip: number = (page - 1) * 5;
  const temporaryPhrase: PhraseProps[] = await Temporary_Phrases.find().skip(skip).limit(5);
  return res.status(200).json(temporaryPhrase);
});

const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.listen(port, () => {
  console.log("Server Started Successfully, Waiting for MongoDB...");
});
