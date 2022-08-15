const { Users } = require("../../../src/models/allusers/hostusers");
const middleValidate = require("../../../middleware/validate");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const express = require("express");
const router = new express.Router();

router.post(
  "/allusers/hostauth",
  middleValidate(validate),
  async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send("Invalid email or password");

    const token = user.generateAuthToken();

    res.send(token);
  }
);

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().required().min(5).max(1024),
  });

  return schema.validate(req);
}

module.exports = router;
