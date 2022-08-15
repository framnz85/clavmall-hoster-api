const { Addiv1, validate } = require("../../../src/models/address/addiv1");
const auth = require("../../../middleware/auth");
const isAdmin = require("../../../middleware/admin");
const validateObjectId = require("../../../middleware/validateObjectId");
const middleValidate = require("../../../middleware/validate");
const ObjectId = require("mongoose").Types.ObjectId;
const express = require("express");
const router = new express.Router();

router.get(
  "/address/addiv1/:couid",
  validateObjectId("couid"),
  async (req, res) => {
    const couid = new ObjectId(req.params.couid);
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
      const addiv1 = await Addiv1(coucode)
        .find({ $text: { $search: searchText }, couid }, "_id name")
        .sort({ [sortkey]: sort })
        .skip(parseInt(skip))
        .limit(parseInt(limit));

      const length = await Addiv1(coucode).countDocuments({
        $text: { $search: searchText },
        couid,
      });

      res.send({ addiv1, length });
    } else {
      const addiv1 = await Addiv1(coucode)
        .find({ couid }, "_id name")
        .sort({ [sortkey]: sort })
        .skip(parseInt(skip))
        .limit(parseInt(limit));

      const length = await Addiv1(coucode).countDocuments({ couid });

      res.send({ addiv1, length });
    }
  }
);

router.post(
  "/address/addiv1/:couid",
  [auth, isAdmin, middleValidate(validate), validateObjectId("couid")],
  async (req, res) => {
    req.body.couid = new ObjectId(req.params.couid);

    const coucode = req.query.coucode;
    if (!coucode)
      return res.status(404).send(`country code: ${coucode} is not valid`);

    Addiv1(coucode)
      .collection.insertOne(req.body)
      .then((result) => {
        res.send(result.ops);
      });
  }
);

router.put(
  "/address/addiv1/:couid/:addiv1",
  [
    auth,
    isAdmin,
    middleValidate(validate),
    validateObjectId("couid"),
    validateObjectId("addiv1"),
  ],
  async (req, res) => {
    const couid = new ObjectId(req.params.couid);
    const addiv1 = new ObjectId(req.params.addiv1);

    const coucode = req.query.coucode;
    if (!coucode)
      return res.status(404).send(`country code: ${coucode} is not valid`);

    const adDivList1 = await Addiv1(coucode).findByIdAndUpdate(
      addiv1,
      req.body,
      {
        new: true,
      }
    );

    if (!adDivList1)
      return res
        .status(404)
        .send(`No address found on couid: ${couid} with addiv1: ${addiv1}`);

    res.send(adDivList1);
  }
);

router.delete(
  "/address/addiv1/:couid/:addiv1",
  [auth, isAdmin, validateObjectId("couid"), validateObjectId("addiv1")],
  async (req, res) => {
    const couid = new ObjectId(req.params.couid);
    const addiv1 = new ObjectId(req.params.addiv1);

    const coucode = req.query.coucode;
    if (!coucode)
      return res.status(404).send(`country code: ${coucode} is not valid`);

    const adDivList1 = await Addiv1(coucode).findByIdAndDelete(addiv1);

    if (!adDivList1) {
      return res
        .status(404)
        .send(`No address found on couid: ${couid} with addiv1: ${addiv1}`);
    }

    res.send(adDivList1);
  }
);

module.exports = router;
