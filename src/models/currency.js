import { SchemaTypes, Schema, model } from "mongoose";
const currencySchema = new Schema(
  {
    titel: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    rate: {
      type: Number,
    },
    user: {
      type: SchemaTypes.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const Currency = model("currency", currencySchema);

export default Currency;
