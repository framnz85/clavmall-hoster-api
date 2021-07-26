const Addiv3 = require("../../../src/models/address/addiv3");
const validateObjectId = require("../../../middleware/validateObjectId");
const ObjectId = require("mongoose").Types.ObjectId;
const express = require("express");
const router = new express.Router();

router.get(
  "/address/addiv3/:addiv1/:addiv2",
  validateObjectId("addiv2"),
  async (req, res) => {
    const addiv1 = parseInt(req.params.addiv1);
    const addiv2 = new ObjectId(req.params.addiv2);
    const coucode = req.query.coucode;

    const addiv3 = await Addiv3(coucode).find(
      { adDivId1: addiv1, adDivId2: addiv2 },
      "_id name"
    );

    if (addiv3.length === 0) {
      return res
        .status(404)
        .send(`No address found on id1: ${addiv1} or id2: ${addiv2}`);
    }

    res.send(addiv3);
  }
);

module.exports = router;
