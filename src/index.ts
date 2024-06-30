import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import authRouter from "./routes/auth-router";
import { authenticate } from "./middlewares/auth-middleware";
import connectDB from "./connections/database";
import { errorHandler } from "./middlewares/error-handler";
import userRouter from "./routes/user-router";

const app = express();
const port = process.env.PORT || 8000;

dotenv.config();

export interface UserBasicInfo {
  _id: string;
  name: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserBasicInfo | null;
    }
  }
}

// NOTE: Use this only if you are deploying
// and if you wanna make this acccessible via frontend.
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true,
//   })
// );

app.use(express.json());
app.use(authRouter);
app.use(cookieParser());
app.use("/users", authenticate, userRouter);
app.use(errorHandler);

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
