const {
  Countries,
  validate,
} = require("../../../src/models/address/countries");
const auth = require("../../../middleware/auth");
const isAdmin = require("../../../middleware/admin");
const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const express = require("express");
const router = new express.Router();

router.get("/address/country", async (req, res) => {
  try {
    const countries = await Countries.find({}, "_id countryCode name");
    res.send(countries);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.post("/address/country", [auth, isAdmin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const country = new Countries(req.body);

  try {
    const result = await country.save();
    res.send(result);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.put("/address/country/:couid", [auth, isAdmin], async (req, res) => {
  if (!ObjectId.isValid(req.params.couid))
    return res
      .status(404)
      .send(`id: ${req.params.couid} is not a valid ObjectId`);

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const couid = new ObjectId(req.params.couid);

  try {
    const country = await Countries.findByIdAndUpdate(couid, req.body, {
      new: true,
    });

    if (!country)
      return res.status(404).send(`No address found on Country ID: ${couid}`);

    res.send(country);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.delete("/address/country/:couid", [auth, isAdmin], async (req, res) => {
  if (!ObjectId.isValid(req.params.couid))
    return res
      .status(404)
      .send(`id: ${req.params.couid} is not a valid ObjectId`);

  const couid = new ObjectId(req.params.couid);

  try {
    const country = await Countries.findByIdAndDelete(couid);

    if (!country) {
      return res.status(404).send(`No address found on Country ID: ${couid}`);
    }

    res.send(country);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = router;
