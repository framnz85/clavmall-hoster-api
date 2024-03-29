const { Users, validate } = require("../../src/models/allusers/hostusers");
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/admin");
const middleValidate = require("../../middleware/validate");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = new express.Router();

router.get("/allusers/hostusers", async (req, res) => {
  const users = await Users.find({}, "name email");
  res.send(users);
});

router.post(
  "/allusers/hostusers",
  [auth, isAdmin, middleValidate(validate)],
  async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });

    if (user)
      return res.status(400).send(`Email: ${req.body.email} already exist`);

    user = new Users(_.pick(req.body, ["name", "email", "password"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    const token = user.generateAuthToken();

    const result = await user.save();
    res
      .header("x-auth-token", token)
      .send(_.pick(user, ["_id", "name", "email"]));
  }
);

module.exports = router;
