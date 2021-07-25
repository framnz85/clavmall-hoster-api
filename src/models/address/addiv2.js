const conn = require("../../../src/db/address");
const mongoose = require("mongoose");

const addiv2Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  adDivId1: {
    type: Number,
    required: true,
  },
});

const Addiv2 = (coucode) => {
  return conn.model(coucode + "addiv2", addiv2Schema);
};

module.exports = Addiv2;
