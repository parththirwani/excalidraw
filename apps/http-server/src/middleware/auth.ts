import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_TOKEN = process.env.JWT_TOKEN || "super-secret-token";

export function middleware(req: Request, res: Response, next: NextFunction) {
  const token = (req.headers["authorization"] ?? "").replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, JWT_TOKEN) as { userId: string };
    //@ts-ignore
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(403).json({ message: "Unauthorized" });
  }
}
