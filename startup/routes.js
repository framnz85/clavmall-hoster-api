const express = require("express");
const cors = require("cors");
const country = require("../src/routers/address/countries");
const addiv1 = require("../src/routers/address/addiv1");
const addiv2 = require("../src/routers/address/addiv2");
const addiv3 = require("../src/routers/address/addiv3");
const users = require("../src/routers/allusers/hostusers");
const estore = require("../src/routers/allusers/estore");
const auth = require("../src/routers/allusers/hostauth");
const payment = require("../src/routers/payments/payment");
const ogpa = require("../src/routers/ogt/ogpa");
const affiliate = require("../src/routers/affiliate/affiliate");
const withdraw = require("../src/routers/allusers/withdraw");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use(cors());
  app.use(country);
  app.use(addiv1);
  app.use(addiv2);
  app.use(addiv3);
  app.use(users);
  app.use(estore);
  app.use(auth);
  app.use(payment);
  app.use(ogpa);
  app.use(affiliate);
  app.use(withdraw);
  app.use("/", (req, res) => {
    res.send("This site is restricted");
  });
  app.use(error);
};
