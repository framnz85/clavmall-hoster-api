const { Withdrawal } = require("../../../src/models/allusers/withdraw");
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

module.exports = router;