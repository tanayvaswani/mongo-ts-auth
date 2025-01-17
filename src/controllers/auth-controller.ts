import { Request, Response } from "express";

import { generateToken, clearToken } from "../utils/auth";
import User from "../models/user-model";

const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: "The user already exists" });
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id as string);

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res
      .status(400)
      .json({ message: "An error occurred while registering the user" });
  }
};

const authenticateUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && user.comparePassword(password)) {
    generateToken(res, user._id as string);

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401).json({ message: "User not found OR password incorrect" });
  }
};

const logoutUser = (req: Request, res: Response) => {
  clearToken(res);

  res.status(200).json({ message: "User logged out" });
};

export { registerUser, authenticateUser, logoutUser };
