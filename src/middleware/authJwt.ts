import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/authConfig";
import jwtDecode from "jwt-decode";
import { AppDataSource } from "../config/dbConfig";
import { User } from "../entities/User";

/**
 * Verification token
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
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

/**
 * Autorisation ADMIN
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  let tokenDecoded = decodedToken(req);

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
        return res.status(404).json({ message: "Require ADMIN role!" });
      }
    }
  }
};

/**
 * Autorisation USER
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
const isUser = async (req: Request, res: Response, next: NextFunction) => {
  let tokenDecoded = decodedToken(req);

  // Get user en question
  let user = await AppDataSource.getRepository(User).findOne({
    where: { id: tokenDecoded?.id },
  });
  if (user) {
    for (const role of user?.roles) {
      if (role === "user") {
        next();
        return;
      } else {
        return res.status(404).json({ message: "Require USER role!" });
      }
    }
  }
};

// Pour décoder le Token recu..............
const decodedToken = (req: Request) => {
  // Recuperer un token dans le hedear de la requête
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // Decode token
  const tokenDecoded: any = jwtDecode(token as string);

  return tokenDecoded;
};

export { verifyToken, isAdmin, isUser };
