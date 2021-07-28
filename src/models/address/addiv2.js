const conn = require("../../../src/db/address");
const mongoose = require("mongoose");
const Joi = require("joi");

const addiv2Schema = new mongoose.Schema({
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
  adDivId1: {
    type: Object,
    required: true,
  },
});

const Addiv2 = (coucode) => {
  return conn.model(coucode + "addiv2", addiv2Schema);
};

function validateAddiv2(addiv2) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
  });

  return schema.validate(addiv2);
}

exports.Addiv2 = Addiv2;
exports.validate = validateAddiv2;
