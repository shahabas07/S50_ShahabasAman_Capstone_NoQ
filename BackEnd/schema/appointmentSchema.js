const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    customerMail: {
      type: String,
      required: true,
    },
    serviceChoosed: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: null, 
    },
  },
  {
    timestamps: true,
  }
);

const appointmentModel = mongoose.model("appointments", appointmentSchema);

module.exports = appointmentModel;
