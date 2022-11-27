const conn = require("../../../src/db/allusers");
const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

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

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      isMaster: this.isMaster,
      isAdmin: this.isAdmin,
      isModerator: this.isModerator,
    },
    process.env.JWT_PRIVATE_KEY
  );

  return token;
};

const Users = conn.model("hostusers", userSchema);

function validateUsers(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().required().min(5).max(1024),
  });

  return schema.validate(user);
}

exports.Users = Users;
exports.validate = validateUsers;
