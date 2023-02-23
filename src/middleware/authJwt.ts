import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/authConfig";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  let authHeader = req.headers["authorization"];
  let token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  });
};

export { verifyToken };
