const { Addiv3, validate } = require("../../src/models/address/addiv3");
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/admin");
const validateObjectId = require("../../middleware/validateObjectId");
const middleValidate = require("../../middleware/validate");
const ObjectId = require("mongoose").Types.ObjectId;
const express = require("express");
const router = new express.Router();

router.get(
  "/address/addiv3/:couid/:addiv1/:addiv2",
  [
    validateObjectId("couid"),
    validateObjectId("addiv1"),
    validateObjectId("addiv2"),
  ],
  async (req, res) => {
    const couid = new ObjectId(req.params.couid);
    const addiv1 = new ObjectId(req.params.addiv1);
    const addiv2 = new ObjectId(req.params.addiv2);
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
      const addiv3 = await Addiv3(coucode)
        .find(
          {
            $text: { $search: searchText },
            couid: couid,
            adDivId1: addiv1,
            adDivId2: addiv2,
          },
          "_id name"
        )
        .sort({ [sortkey]: sort })
        .skip(parseInt(skip))
        .limit(parseInt(limit));

      const length = await Addiv3(coucode).countDocuments({
        $text: { $search: searchText },
        couid: couid,
        adDivId1: addiv1,
        adDivId2: addiv2,
      });

      res.send({ addiv3, length });
    } else {
      const addiv3 = await Addiv3(coucode)
        .find({ couid: couid, adDivId1: addiv1, adDivId2: addiv2 }, "_id name")
        .sort({ [sortkey]: sort })
        .skip(parseInt(skip))
        .limit(parseInt(limit));

      const length = await Addiv3(coucode).countDocuments({
        couid: couid,
        adDivId1: addiv1,
        adDivId2: addiv2,
      });

      res.send({ addiv3, length });
    }
  }
);

router.post(
  "/address/addiv3/:couid/:addiv1/:addiv2",
  [
    auth,
    isAdmin,
    middleValidate(validate),
    validateObjectId("couid"),
    validateObjectId("addiv1"),
    validateObjectId("addiv2"),
  ],
  async (req, res) => {
    req.body.couid = new ObjectId(req.params.couid);
    req.body.adDivId1 = new ObjectId(req.params.addiv1);
    req.body.adDivId2 = new ObjectId(req.params.addiv2);

    const coucode = req.query.coucode;
    if (!coucode)
      return res.status(404).send(`country code: ${coucode} is not valid`);

    Addiv3(coucode)
      .collection.insertOne(req.body)
      .then((result) => {
        res.send(result.ops);
      });
  }
);

router.put(
  "/address/addiv3/:couid/:addiv1/:addiv2/:addiv3",
  [
    auth,
    isAdmin,
    middleValidate(validate),
    validateObjectId("couid"),
    validateObjectId("addiv1"),
    validateObjectId("addiv2"),
    validateObjectId("addiv3"),
  ],
  async (req, res) => {
    const couid = new ObjectId(req.params.couid);
    const addiv1 = new ObjectId(req.params.addiv1);
    const addiv2 = new ObjectId(req.params.addiv2);
    const addiv3 = new ObjectId(req.params.addiv3);

    const coucode = req.query.coucode;
    if (!coucode)
      return res.status(404).send(`country code: ${coucode} is not valid`);

    const adDivList3 = await Addiv3(coucode).findByIdAndUpdate(
      addiv3,
      req.body,
      {
        new: true,
      }
    );

    if (!adDivList3)
      return res
        .status(404)
        .send(
          `No address found on couid: ${couid} with addiv1: ${addiv1}, addiv2: ${addiv2}, and addiv3: ${addiv3}`
        );

    res.send(adDivList3);
  }
);

router.delete(
  "/address/addiv3/:couid/:addiv1/:addiv2/:addiv3",
  [
    auth,
    isAdmin,
    validateObjectId("couid"),
    validateObjectId("addiv1"),
    validateObjectId("addiv1"),
    validateObjectId("addiv2"),
    validateObjectId("addiv3"),
  ],
  async (req, res) => {
    const couid = new ObjectId(req.params.couid);
    const addiv1 = new ObjectId(req.params.addiv1);
    const addiv2 = new ObjectId(req.params.addiv2);
    const addiv3 = new ObjectId(req.params.addiv3);

    const coucode = req.query.coucode;
    if (!coucode)
      return res.status(404).send(`country code: ${coucode} is not valid`);

    const adDivList3 = await Addiv3(coucode).findByIdAndDelete(addiv3);

    if (!adDivList3) {
      return res
        .status(404)
        .send(
          `No address found on couid: ${couid} with addiv1: ${addiv1}, addiv2: ${addiv2}, and addiv3: ${addiv3}`
        );
    }

    res.send(adDivList3);
  }
);

module.exports = router;
