const express = require("express");
const country = require("../src/routers/address/countries");
const addiv1 = require("../src/routers/address/addiv1");
const addiv2 = require("../src/routers/address/addiv2");
const addiv3 = require("../src/routers/address/addiv3");
const users = require("../src/routers/allusers/hostusers");
const auth = require("../src/routers/allusers/hostauth");

module.exports = function (app) {
  app.use(express.json());
  app.use(country);
  app.use(addiv1);
  app.use(addiv2);
  app.use(addiv3);
  app.use(users);
  app.use(auth);
};
