import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  tocken: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "user",
    required: true,
  },
});

const Session = mongoose.model("Session", sessionSchema);

export default Session;
