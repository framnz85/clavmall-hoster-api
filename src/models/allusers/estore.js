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
