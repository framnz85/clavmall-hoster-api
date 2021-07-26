const {
  Countries,
  validate,
} = require("../../../src/models/address/countries");
const auth = require("../../../middleware/auth");
const isAdmin = require("../../../middleware/admin");
const validateObjectId = require("../../../middleware/validateObjectId");
const middleValidate = require("../../../middleware/validate");
const ObjectId = require("mongoose").Types.ObjectId;
const express = require("express");
const router = new express.Router();

router.get("/address/country", async (req, res) => {
  const countries = await Countries.find({}, "_id countryCode name");
  res.send(countries);
});

router.post(
  "/address/country",
  [auth, isAdmin, middleValidate(validate)],
  async (req, res) => {
    const country = new Countries(req.body);
    const result = await country.save();
    res.send(result);
  }
);

router.put(
  "/address/country/:couid",
  [auth, isAdmin, middleValidate(validate), validateObjectId("couid")],
  async (req, res) => {
    const couid = new ObjectId(req.params.couid);
    const country = await Countries.findByIdAndUpdate(couid, req.body, {
      new: true,
    });

    if (!country)
      return res.status(404).send(`No address found on Country ID: ${couid}`);

    res.send(country);
  }
);

router.delete(
  "/address/country/:couid",
  [auth, isAdmin, validateObjectId("couid")],
  async (req, res) => {
    const couid = new ObjectId(req.params.couid);
    const country = await Countries.findByIdAndDelete(couid);

    if (!country) {
      return res.status(404).send(`No address found on Country ID: ${couid}`);
    }

    res.send(country);
  }
);

module.exports = router;
