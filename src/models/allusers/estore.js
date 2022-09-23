const conn = require("../../db/allusers");
const mongoose = require("mongoose");
const Joi = require("joi");

const estoreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  owner: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  email: String,
  mobile: String,
  password: String,
  urlname1: {
    type: String,
    unique: true,
  },
  urlname2: String,
  urlname3: String,
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
  estoreName: String,
  estoreEmail: String,
  estoreSupid: String,
  estoreUrlname: String,
});

const Estore = conn.model("Estore", estoreSchema);

function validateEstore(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(user);
}

exports.Estore = Estore;
exports.validate = validateEstore;
