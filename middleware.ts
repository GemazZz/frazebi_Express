import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
require("dotenv").config();

const User = require("./models/User.models");

export const authorization = (req: Request, res: Response, next: NextFunction) => {
  const token: string | undefined = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.secretKey as string, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: err });
    }

    (req as any).user = user;
    console.log(user);
    next();
  });
};

export const adminCheck = (req: Request, res: Response, next: NextFunction) => {
  const token: string | undefined = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.secretKey as string, async (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: err });
    }

    const foundAdmin = await User.findOne({ _id: user.userId });

    if (foundAdmin.role === "admin") {
      (req as any).user = user;
      next();
    } else {
      return res.status(401).json({ error: "not Admin" });
    }
  });
};
