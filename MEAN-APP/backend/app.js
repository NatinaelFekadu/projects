import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path from "path";

import { postsRouter } from "./routes/posts.js";
import { userRouter } from "./routes/user.js";

export const app = express();

mongoose
  .connect("mongodb://localhost:27017/mean", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Database!");
  })
  .catch(() => {
    console.log("Connection Failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-with,Content-Type,Accept,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,PUT,DELETE,OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRouter);
app.use("/api/user", userRouter);

// module.exports = app;
