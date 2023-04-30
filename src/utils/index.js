import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";


export const tryWrapper = (controller) => {
  return (req, res, next) => {
    controller(req, res, next).catch(next);
  };
};

export const generateToken = async ({ user, session }) => {
  const secret = process.env.SECRET;
  const payload = { user, session };
  const token = jwt.sign(payload, secret, { expiresIn: "60m" });
  const refreshToken = jwt.sign(payload, secret);

  return { token, refreshToken };
};

export const chekValidObjectID = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) return true;
  throw new Error("ID not correct");
};

export const hashedPassword = async (password) => {
  const hesh = await bcrypt.hash(password, 12);
  return hesh;
};

export const isNumeric = (n) => !isNaN(n);