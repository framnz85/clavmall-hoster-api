const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const conn = require("../../../src/db/estore");

const affiliateSchema = new mongoose.Schema(
  {
    withid: ObjectId,
    userid: ObjectId,
    name: {
      type: String,
      required: true,
    },
    product: {
      type: String,
      required: true,
    },
    amount: Number,
    commission: Number,
    status: {
      type: String,
      default: "Pending",
      enum: [
        "Pending",
        "Approved",
      ],
    },
  },
  { timestamps: true }
);

const Affiliate = (estoreid) => {
  return conn[estoreid].model("Affiliate", affiliateSchema);
};

module.exports = Affiliate;