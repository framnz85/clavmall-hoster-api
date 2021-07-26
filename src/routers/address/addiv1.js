const { Countries } = require("../../../src/models/address/countries");
const validateObjectId = require("../../../middleware/validateObjectId");
const ObjectId = require("mongoose").Types.ObjectId;
const express = require("express");
const router = new express.Router();

router.get(
  "/address/addiv1/:couid",
  validateObjectId("couid"),
  async (req, res) => {
    const couid = new ObjectId(req.params.couid);
    const addiv1 = await Countries.findById({ _id: couid }, "adDivList1");

    if (!addiv1) {
      return res.status(404).send(`No address found on id: ${couid}`);
    }
    res.send(addiv1.adDivList1);
  }
);

module.exports = router;
