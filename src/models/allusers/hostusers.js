const conn = require("../../../src/db/allusers");
const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 255 },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  password: { type: String, required: true, minlength: 5, maxlength: 1024 },
  isMaster: Boolean,
  isAdmin: Boolean,
  isModerator: Boolean,
});

const Users = conn.model("hostusers", userSchema);

function validateUsers(user) {
  const schema = {
    name: Joi.string().min(5).max(255).required(),
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().required().min(5).max(1024),
  };

  return Joi.validate(user, schema);
}

exports.Users = Users;
exports.validate = validateUsers;
