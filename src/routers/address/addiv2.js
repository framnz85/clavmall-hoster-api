const { Addiv2, validate } = require("../../../src/models/address/addiv2");
const auth = require("../../../middleware/auth");
const isAdmin = require("../../../middleware/admin");
const validateObjectId = require("../../../middleware/validateObjectId");
const middleValidate = require("../../../middleware/validate");
const ObjectId = require("mongoose").Types.ObjectId;
const express = require("express");
const router = new express.Router();

router.get(
  "/address/addiv2/:couid/:addiv1",
  [validateObjectId("couid"), validateObjectId("addiv1")],
  async (req, res) => {
    const couid = new ObjectId(req.params.couid);
    const addiv1 = new ObjectId(req.params.addiv1);
    const {
      sortkey = "name",
      sort = 1,
      limit = 0,
      skip = 0,
      searchText = "",
    } = req.query;

    const coucode = req.query.coucode;
    if (!coucode)
      return res.status(404).send(`country code: ${coucode} is not valid`);

    if (searchText.length > 0) {
      const addiv2 = await Addiv2(coucode)
        .find(
          { $text: { $search: searchText }, couid, adDivId1: addiv1 },
          "_id name"
        )
        .sort({ [sortkey]: sort })
        .skip(parseInt(skip))
        .limit(parseInt(limit));

      const length = await Addiv2(coucode).countDocuments({
        $text: { $search: searchText },
        couid,
        adDivId1: addiv1,
      });

      res.send({ addiv2, length });
    } else {
      const addiv2 = await Addiv2(coucode)
        .find({ couid, adDivId1: addiv1 }, "_id name")
        .sort({ [sortkey]: sort })
        .skip(parseInt(skip))
        .limit(parseInt(limit));

      const length = await Addiv2(coucode).countDocuments({
        couid,
        adDivId1: addiv1,
      });

      res.send({ addiv2, length });
    }
  }
);

router.post(
  "/address/addiv2/:couid/:addiv1",
  [
    auth,
    isAdmin,
    middleValidate(validate),
    validateObjectId("couid"),
    validateObjectId("addiv1"),
  ],
  async (req, res) => {
    req.body.couid = new ObjectId(req.params.couid);
    req.body.adDivId1 = new ObjectId(req.params.addiv1);

    const coucode = req.query.coucode;
    if (!coucode)
      return res.status(404).send(`country code: ${coucode} is not valid`);

    Addiv2(coucode)
      .collection.insertOne(req.body)
      .then((result) => {
        res.send(result.ops);
      });
  }
);

router.put(
  "/address/addiv2/:couid/:addiv1/:addiv2",
  [
    auth,
    isAdmin,
    middleValidate(validate),
    validateObjectId("couid"),
    validateObjectId("addiv1"),
    validateObjectId("addiv2"),
  ],
  async (req, res) => {
    const couid = new ObjectId(req.params.couid);
    const addiv1 = new ObjectId(req.params.addiv1);
    const addiv2 = new ObjectId(req.params.addiv2);

    const coucode = req.query.coucode;
    if (!coucode)
      return res.status(404).send(`country code: ${coucode} is not valid`);

    const adDivList2 = await Addiv2(coucode).findByIdAndUpdate(
      addiv2,
      req.body,
      {
        new: true,
      }
    );

    if (!adDivList2)
      return res
        .status(404)
        .send(
          `No address found on couid: ${couid} with addiv1: ${addiv1} and addiv2: ${addiv2}`
        );

    res.send(adDivList2);
  }
);

router.delete(
  "/address/addiv2/:couid/:addiv1/:addiv2",
  [
    auth,
    isAdmin,
    validateObjectId("couid"),
    validateObjectId("addiv1"),
    validateObjectId("addiv1"),
    validateObjectId("addiv2"),
  ],
  async (req, res) => {
    const couid = new ObjectId(req.params.couid);
    const addiv1 = new ObjectId(req.params.addiv1);
    const addiv2 = new ObjectId(req.params.addiv2);

    const coucode = req.query.coucode;
    if (!coucode)
      return res.status(404).send(`country code: ${coucode} is not valid`);

    const adDivList2 = await Addiv2(coucode).findByIdAndDelete(addiv2);

    if (!adDivList2) {
      return res
        .status(404)
        .send(
          `No address found on couid: ${couid} with addiv1: ${addiv1} and addiv2: ${addiv2}`
        );
    }

    res.send(adDivList2);
  }
);

module.exports = router;
