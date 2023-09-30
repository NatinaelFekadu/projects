import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

const createUser = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
    });
    const result = await user.save();
    res.status(201).json({
      message: "User Created!",
      result: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Invalid credentials!",
    });
  }
};

const userLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({
        message: "Auth Failed",
      });
    }
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (result) {
        const token = jwt.sign(
          { email: user.email, userId: user._id },
          process.env.JWT_KEY,
          { expiresIn: "1h" }
        );
        res.status(200).json({
          token: token,
          expiresIn: 3600,
          userId: user._id,
        });
      } else {
        return res.status(401).json({
          message: "Auth Failed",
        });
      }
    });
  } catch (error) {
    res.status(401).json({
      message: "Invalid credentials!",
    });
  }
};

export const userController = { createUser, userLogin };
