const conn = require("../../db/address");
const mongoose = require("mongoose");
const Joi = require("joi");

const addiv1Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  couid: {
    type: Object,
    required: true,
  },
});

const Addiv1 = (coucode) => {
  return conn.model(coucode + "addiv1", addiv1Schema);
};

function validateAddiv1(addiv1) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
  });

  return schema.validate(addiv1);
}

exports.Addiv1 = Addiv1;
exports.validate = validateAddiv1;
