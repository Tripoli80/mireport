import mongoose from "mongoose";
import ServiceType from "./serviceType.js";
const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "currency",
      required: true,
    },
  },
  duration: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "user",
    required: true,
  },
  serviceType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "serviceType",
    required: true,
    validate: {
      validator: async function (value) {
        const serviceType = await ServiceType.findById(value);
        return serviceType !== null;
      },
      message: "Service type not found",
    },
  },
});

const Service = mongoose.model("service", serviceSchema);

export default Service;
