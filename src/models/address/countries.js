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
    minlength: 3,
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
  adDivList1: [String],
});

const Countries = mongoose.model("Countries", countrySchema);

function validateCountry(country) {
  const schema = {
    name: Joi.string().min(2).max(255).required(),
    countryCode: Joi.string().min(2).max(3).required(),
    currency: Joi.string().min(3).max(3).required(),
    adDivName1: Joi.string().min(2).max(255),
    adDivName2: Joi.string().min(2).max(255),
    adDivName3: Joi.string().min(2).max(255),
  };

  return Joi.validate(country, schema);
}

exports.Countries = Countries;
exports.validate = validateCountry;
