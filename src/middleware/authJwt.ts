import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/authConfig";
import jwtDecode from "jwt-decode";
import { AppDataSource } from "../config/dbConfig";
import { User } from "../entities/User";

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

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // Decode token
  const tokenDecoded: any = jwtDecode(token as string);

  // Get user en question
  let user = await AppDataSource.getRepository(User).findOne({
    where: { id: tokenDecoded?.id },
  });

  if (user) {
    for (const role of user?.roles) {
      if (role === "admin") {
        next();
        return;
      } else {
        return res.status(404).json({ message: "Require Admin Role!" });
      }
    }
  }
};

export { verifyToken, isAdmin };
