import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    default: "",
    trim: true,
  },
  age: {
    type: Number,
    default: 18,

    trim: true,
  },
  description: {
    type: String,
    default: "",

    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  settings: {
    language: { type: String, default: "UA" },
    theme: { type: String, default: "light" },
    notifications: { type: Boolean, default: true },
    other: { type: Schema.Types.Mixed, default: {bla:"Додаєте любі філди та любі значення"} },
  },
  customfield: { type: Schema.Types.Mixed },
  password: {
    type: String,
    required: true,
    trim: true,
  },
});

const User = model("user", userSchema);

export default User;
