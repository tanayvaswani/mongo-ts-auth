import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { UserBasicInfo } from "../index";
import User from "../models/user-model";
import { AuthenticationError } from "./error-handler";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.cookies.jwt;

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, token not found");
    }

    const jwtSecret = process.env.JWT_SECRET || "";
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    if (!decoded || !decoded.userId) {
      res.status(401);
      throw new Error("Not authorized, userId not found");
    }

    const user = await User.findById(decoded.userId, "_id name email");

    if (!user) {
      res.status(401);
      throw new Error("Not authorized, user not found");
    }

    req.user = user as UserBasicInfo;
    next();
  } catch (e) {
    res.status(401);
    throw new AuthenticationError("Invalid token");
  }
};

export { authenticate };
