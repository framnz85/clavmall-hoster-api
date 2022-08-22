const { Estore, validate } = require("../../models/allusers/estore");
const auth = require("../../../middleware/auth");
const isAdmin = require("../../../middleware/admin");
const validateObjectId = require("../../../middleware/validateObjectId");
const middleValidate = require("../../../middleware/validate");
const ObjectId = require("mongoose").Types.ObjectId;
const express = require("express");
const router = new express.Router();

router.get("/allusers/estore", async (req, res) => {
  const {
    sortkey = "name",
    sort = 1,
    limit = 0,
    skip = 0,
    searchText = "",
  } = req.query;

  if (searchText.length > 0) {
    const estores = await Estore.find(
      { $text: { $search: searchText } },
      "_id name"
    )
      .sort({ [sortkey]: sort })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const length = await Estore.countDocuments();

    res.send({ estores, length });
  } else {
    const estores = await Estore.find({}, "_id name")
      .sort({ [sortkey]: sort })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const length = await Estore.countDocuments();

    res.send({ estores, length });
  }
});

router.get("/user/estore", async (req, res) => {
  const { estoreid } = req.query;

  const estore = await Estore.find({ _id: ObjectId(estoreid) });

  res.send({ estore });
});

router.post(
  "/allusers/estore", async (req, res) => {
    try {
      const estore = new Estore(req.body);
      const result = await estore.save();
      res.send(result);
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).send("Clavstore name already exist.");
      } else {
        res.status(400).send("Create Clavstore failed.");
      }
    }
  }
);

router.put(
  "/allusers/estore/:estid",
  [auth, isAdmin, middleValidate(validate), validateObjectId("estid")],
  async (req, res) => {
    const estid = new ObjectId(req.params.estid);
    const estore = await Estore.findByIdAndUpdate(estid, req.body, {
      new: true,
    });

    if (!estore)
      return res.status(404).send(`No address found on Clavstore ID: ${estid}`);

    res.send(estore);
  }
);

router.delete(
  "/allusers/estore/:estid",
  [auth, isAdmin, validateObjectId("estid")],
  async (req, res) => {
    const estid = new ObjectId(req.params.estid);
    const estore = await Estore.findByIdAndDelete(estid);

    if (!estore) {
      return res.status(404).send(`No address found on Clavstore ID: ${estid}`);
    }

    res.send(estore);
  }
);

module.exports = router;
