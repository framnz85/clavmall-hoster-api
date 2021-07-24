const { Countries } = require("../../../src/models/address/countries");
const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const express = require("express");
const router = new express.Router();

router.get("/address/addiv1/:couid", async (req, res) => {
  if (!ObjectId.isValid(req.params.couid))
    return res.status(404).send(`id: ${req.params.couid} is not an ObjectId`);

  const couid = new ObjectId(req.params.couid);

  try {
    const addiv1 = await Countries.findById({ _id: couid }, "adDivList1");
    if (!addiv1) {
      return res.status(404).send(`No address found on id: ${couid}`);
    }
    res.send(addiv1.adDivList1);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = router;
