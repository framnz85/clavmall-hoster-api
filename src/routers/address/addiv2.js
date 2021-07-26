const Addiv2 = require("../../../src/models/address/addiv2");
const express = require("express");
const router = new express.Router();

router.get("/address/addiv2/:addiv1", async (req, res) => {
  const addiv1 = parseInt(req.params.addiv1);
  const coucode = req.query.coucode;
  const addiv2 = await Addiv2(coucode).find({ adDivId1: addiv1 }, "_id name");

  if (addiv2.length === 0) {
    return res.status(404).send(`No address found on id1: ${addiv1}`);
  }

  res.send(addiv2);
});

module.exports = router;
