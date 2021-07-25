const conn = require("../../../src/db/address");
const mongoose = require("mongoose");

const addiv3Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  adDivId2: {
    type: Number,
    required: true,
  },
  adDivId2: {
    type: Object,
    required: true,
  },
});

const Addiv3 = (coucode) => {
  return conn.model(coucode + "addiv3", addiv3Schema);
};

module.exports = Addiv3;
