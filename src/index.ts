import cors from "cors";

import dotenv from "dotenv";
import express from "express";

import authRouter from "./routes/auth-router";
import connectDB from "./connections/database";

const app = express();
const port = process.env.PORT || 8000;

dotenv.config();
connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(authRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
