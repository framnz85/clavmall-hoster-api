const { Affiliate } = require("../../models/affiliate/affiliate");
const auth = require("../../../middleware/auth");
const isAdmin = require("../../../middleware/admin");
const validateObjectId = require("../../../middleware/validateObjectId");
const ObjectId = require("mongoose").Types.ObjectId;
const express = require("express");
const router = new express.Router();

router.put(
  "/estore/estore/:estid/:affid",
  [auth, isAdmin, validateObjectId("estid")], validateObjectId("affid"),
  async (req, res) => {
    const estid = new ObjectId(req.params.estid);
    const affid = new ObjectId(req.params.affid);
    const affiliate = await Affiliate(estid).findByIdAndUpdate(affid, req.body, {
      new: true,
    });

    if (!affiliate)
      return res.status(404).send(`No affiliate found on Affiliate ID: ${affid}`);

    res.send(affiliate);
  }
);

// router.delete(
//   "/allusers/estore/:estid",
//   [auth, isAdmin, validateObjectId("estid")],
//   async (req, res) => {
//     const estid = new ObjectId(req.params.estid);
//     const estore = await Estore.findByIdAndDelete(estid);

//     if (!estore) {
//       return res.status(404).send(`No address found on Clavstore ID: ${estid}`);
//     }

//     res.send(estore);
//   }
// );

module.exports = router;
