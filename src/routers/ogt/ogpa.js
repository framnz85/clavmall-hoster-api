const { Ogpa } = require("../../../src/models/ogt/ogpa");
const auth = require("../../../middleware/auth");
const isAdmin = require("../../../middleware/admin");
const validateObjectId = require("../../../middleware/validateObjectId");
const ObjectId = require("mongoose").Types.ObjectId;
const express = require("express");
const router = new express.Router();
const md5 = require('md5');

router.get("/ogt/ogpa", async (req, res) => {
  const {
    sortkey = "name",
    sort = 1,
    limit = 0,
    skip = 0,
    searchText = "",
  } = req.query;

  if (searchText.length > 0) {
    const ogpa = await Ogpa.find({ $text: { $search: searchText } })
      .sort({ [sortkey]: sort })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const length = await Ogpa.countDocuments({
      $text: { $search: searchText },
    });

    res.send({ ogpa, length });
  } else {
    const ogpa = await Ogpa.find({})
      .sort({ [sortkey]: sort })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const length = await Ogpa.countDocuments();

    res.send({ ogpa, length });
  }
});

router.put(
  "/ogt/ogpa/:ogpaid",
  [auth, isAdmin, validateObjectId("ogpaid")],
  async (req, res) => {
    const ogpaid = new ObjectId(req.params.ogpaid);
    const password = req.body.password
    const md5pass = md5(password);
    const ogpa = await Ogpa.findByIdAndUpdate(ogpaid, {...req.body, md5pass}, {
      new: true,
    });

    if (!ogpa)
      return res.status(404).send(`No user found on Ogpa ID: ${ogpaid}`);

    res.send(ogpa);
  }
);

router.delete(
  "/ogt/ogpa/:ogpaid",
  [auth, isAdmin, validateObjectId("ogpaid")],
  async (req, res) => {
    const ogpaid = new ObjectId(req.params.ogpaid);
    const ogpa = await Ogpa.findByIdAndDelete(ogpaid);

    if (!ogpa) {
      return res.status(404).send(`No user found on Ogpa ID: ${ogpa}`);
    }

    res.send(ogpa);
  }
);

module.exports = router;
