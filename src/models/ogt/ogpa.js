const conn = require("../../db/ogt");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const Joi = require("joi");

const ogpaSchema = new mongoose.Schema(
  {
    amount: String,
    name: {
      type: String,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      index: true,
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
        "pause",
        "stop",
        "active",
      ],
    },
  }
);

const Ogpa = conn.model("Ogpa", ogpaSchema);

exports.Ogpa = Ogpa;
