import mongoose from "mongoose";

const serviceTypeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "user",
  },
});

const ServiceType = mongoose.model("serviceType", serviceTypeSchema);

export default ServiceType;
