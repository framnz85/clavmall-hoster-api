const conn = require("../../db/ogt");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ogpaSchema = new mongoose.Schema(
  {
    amount: String,
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    refid: ObjectId,
    password: String,
    mobile: String,
    payment: String,
    payDetails: String,
    dateStart: Date,
    md5pass: String,
    status: {
      type: String,
      default: "pending",
      enum: [
        "pending",
        "paid",
        "active",
      ],
    },
  }
);

ogpaSchema.index({ name: 'text', email: 'text' });

const Ogpa = conn.model("Ogpa", ogpaSchema);

exports.Ogpa = Ogpa;
