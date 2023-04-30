import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "new",
  },
  amount: {
    count: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "currency",
    },
  },
  desc: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "user",
  },
  client: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "client",
  },
  customfield: { type: mongoose.Schema.Types.Mixed },
});

const Event = mongoose.model("event", eventSchema);

export default Event;
