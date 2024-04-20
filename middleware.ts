import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
require("dotenv").config();

const authorization = (req: Request, res: Response, next: NextFunction) => {
  const token: string | undefined = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.secretKey as string, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden" });
    }

    (req as any).user = user;
    next();
  });
};

export default authorization;
