import express from "express";

import authRouter from "./routes/auth-router";

const app = express();
const port = process.env.PORT || 8000;

app.use(authRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
