const conn = require("../../../src/db/address");
const mongoose = require("mongoose");
const Joi = require("joi");

const addiv3Schema = new mongoose.Schema({
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
  adDivId2: {
    type: Object,
    required: true,
  },
});

const Addiv3 = (coucode) => {
  return conn.model(coucode + "addiv3", addiv3Schema);
};

function validateAddiv3(addiv3) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
  });

  return schema.validate(addiv3);
}

exports.Addiv3 = Addiv3;
exports.validate = validateAddiv3;
