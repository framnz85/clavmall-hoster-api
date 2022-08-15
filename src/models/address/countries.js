const conn = require("../../../src/db/address");
const mongoose = require("mongoose");
const Joi = require("joi");

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  countryCode: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 3,
  },
  currency: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 3,
  },
  currencyAlt: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 3,
  },
  adDivName1: {
    type: String,
    minlength: 2,
    maxlength: 255,
  },
  adDivName2: {
    type: String,
    minlength: 2,
    maxlength: 255,
  },
  adDivName3: {
    type: String,
    minlength: 2,
    maxlength: 255,
  },
});

const Countries = conn.model("Countries", countrySchema);

function validateCountry(country) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    countryCode: Joi.string().min(2).max(3).required(),
    currency: Joi.string().min(3).max(3).required(),
    adDivName1: Joi.string().min(2).max(255),
    adDivName2: Joi.string().min(2).max(255),
    adDivName3: Joi.string().min(2).max(255),
  });

  return schema.validate(country);
}

exports.countrySchema = countrySchema;
exports.Countries = Countries;
exports.validate = validateCountry;
