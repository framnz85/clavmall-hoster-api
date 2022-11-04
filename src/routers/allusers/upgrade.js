const { Estore } = require("../../models/allusers/estore");
const auth = require("../../../middleware/auth");
const isAdmin = require("../../../middleware/admin");
const validateObjectId = require("../../../middleware/validateObjectId");
const ObjectId = require("mongoose").Types.ObjectId;
const express = require("express");
const router = new express.Router();

router.get("/estore/upgrade", async (req, res) => {
  const upgrades = await Estore.find({}, "_id name billingHistory");
  res.send({ upgrades });
});

router.put(
  "/estore/upgrade/:billid",
  [auth, isAdmin, validateObjectId("billid")],
  async (req, res) => {

    try {
    const billid = new ObjectId(req.params.billid);
    const estoreid = req.body.estoreid;
    
    const estore = await Estore.findOne({ _id: ObjectId(estoreid) });
    const newBillingHistory = estore.billingHistory.map(bill => bill._id.toString() === billid.toString() ? { ...bill._doc, payStatus: req.body.payStatus } : bill);
    
    const newEstore = await Estore.findOneAndUpdate(
      { _id: ObjectId(estoreid) },
      { billingHistory: newBillingHistory, estoreChange: 0 },
      { new: true }
    )

    res.send(newEstore);
  
    } catch (error) {
      console.log(error)
    }
  }
);

module.exports = router;
