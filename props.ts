import { Request } from "express";

interface User {
  userId: string;
  iat: number;
  exp: number;
}
export interface AuthenticatedRequest extends Request {
  user: User;
}

export interface UsersSchemaProps {
  name: String;
  surname: String;
  email: String;
  password: String;
  role: String;
  favorites: String[];
  created_at: String;
}
