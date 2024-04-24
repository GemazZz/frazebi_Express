import { Request } from "express";
import { Document } from "mongoose";

interface User {
  userId: string;
  iat: number;
  exp: number;
}
export interface AuthenticatedRequest extends Request {
  user: User;
}

export interface UserProps extends Document {
  _id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  role: string;
  favorites: string[];
  created_at: string;
}

export interface SignInProps {
  email: string;
  password: string;
}

export interface PhraseProps extends Document {
  category: string;
  content: string;
  author: string;
  date: string;
}
