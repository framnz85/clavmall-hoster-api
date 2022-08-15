const { Payment, validate } = require("../../../src/models/payments/payment");
const auth = require("../../../middleware/auth");
const isAdmin = require("../../../middleware/admin");
const validateObjectId = require("../../../middleware/validateObjectId");
const middleValidate = require("../../../middleware/validate");
const ObjectId = require("mongoose").Types.ObjectId;
const express = require("express");
const router = new express.Router();

router.get("/payments/payment", async (req, res) => {
  const {
    sortkey = "name",
    sort = 1,
    limit = 0,
    skip = 0,
    searchText = "",
  } = req.query;

  if (searchText.length > 0) {
    const payments = await Payment.find(
      { $text: { $search: searchText } },
      "_id name category"
    )
      .sort({ [sortkey]: sort })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const length = await Payment.countDocuments({
      $text: { $search: searchText },
    });

    res.send({ payments, length });
  } else {
    const payments = await Payment.find({}, "_id name category")
      .sort({ [sortkey]: sort })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const length = await Payment.countDocuments();

    res.send({ payments, length });
  }
});

router.post(
  "/payments/payment",
  [auth, isAdmin, middleValidate(validate)],
  async (req, res) => {
    try {
      const payment = new Payment(req.body);
      const result = await payment.save();
      res.send(result);
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).send("Payment name already exist.");
      } else {
        res.status(400).send("Adding payment failed.");
      }
    }
  }
);

router.put(
  "/payments/payment/:payid",
  [auth, isAdmin, middleValidate(validate), validateObjectId("payid")],
  async (req, res) => {
    try {
      const payid = new ObjectId(req.params.payid);
      const payment = await Payment.findByIdAndUpdate(payid, req.body, {
        new: true,
      });

      if (!payment)
        return res.status(404).send(`No address found on Payment ID: ${payid}`);

      res.send(payment);
    } catch (error) {
      res.send(error);
    }
  }
);

router.delete(
  "/payments/payment/:payid",
  [auth, isAdmin, validateObjectId("payid")],
  async (req, res) => {
    const payid = new ObjectId(req.params.payid);
    const payment = await Payment.findByIdAndDelete(payid);

    if (!payment) {
      return res.status(404).send(`No address found on estore ID: ${payid}`);
    }

    res.send(payment);
  }
);

module.exports = router;
