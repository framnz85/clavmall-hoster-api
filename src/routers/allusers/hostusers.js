const { Users } = require("../../../src/models/allusers/hostusers");
const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const express = require("express");
const router = new express.Router();

router.get("/allusers/hostusers", async (req, res) => {
  try {
    const users = await Users.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = router;
