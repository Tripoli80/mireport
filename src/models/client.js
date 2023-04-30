import mongoose from "mongoose";
const { Schema, model } = mongoose;

const clientSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "---"],
      default: "---",
    },
    events: [
      {
        type: Schema.Types.ObjectId,
        ref: "events",
      },
    ],
    customfield: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const Client = model("client", clientSchema);

export default Client;
