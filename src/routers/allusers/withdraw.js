const { Withdrawal } = require("../../../src/models/allusers/withdraw");
const Affiliate = require("../../models/affiliate/affiliate");
const auth = require("../../../middleware/auth");
const isAdmin = require("../../../middleware/admin");
const validateObjectId = require("../../../middleware/validateObjectId");
const ObjectId = require("mongoose").Types.ObjectId;
const express = require("express");
const router = new express.Router();

router.get("/withdraw/withdrawal", async (req, res) => {
    const {
        sortkey = "createdAt",
        sort = 1,
        limit = 0,
        skip = 0,
        searchText = "",
    } = req.query;
  
    if (searchText.length > 0) {
        const withdrawals = await Withdrawal.find({ $text: { $search: searchText } })
        .sort({ [sortkey]: sort })
        .skip(parseInt(skip))
        .limit(parseInt(limit));

        const length = await Withdrawal.countDocuments({
            $text: { $search: searchText },
        });

        res.send({ withdrawals, length });
    } else {
        const withdrawals = await Withdrawal.find({})
        .sort({ [sortkey]: sort })
        .skip(parseInt(skip))
        .limit(parseInt(limit));

        const length = await Withdrawal.countDocuments();

        res.send({ withdrawals, length });
    }
});

router.put(
  "/withdraw/withdrawal/:withid",
  [auth, isAdmin, validateObjectId("withid")],
  async (req, res) => {

    try {
    const withid = new ObjectId(req.params.withid);
    const status = req.body.status;
    let withdraw;
    if (status === "Approved") {
      withdraw = await Withdrawal.findByIdAndUpdate(withid, req.body, {
        new: true,
      });
      await Affiliate(req.body.estoreid).findByIdAndUpdate(req.body.affid, {status: "Approved"}, {
        new: true,
      });
    } else {
      withdraw = await Withdrawal.findByIdAndUpdate(withid, req.body, {
        new: true,
      });
    }

    if (!withdraw)
      return res.status(404).send(`No user found on Withdrawal ID: ${withid}`);

    res.send(withdraw);
  
    } catch (error) {
      console.log(error)
    }
  }
);

module.exports = router;