const conn = require("../../../src/db/allusers");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const withdrawalSchema = new mongoose.Schema(
  {
    estoreid: ObjectId,
    affid: ObjectId,
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

const Withdrawal = conn.model("Withdrawal", withdrawalSchema);

exports.Withdrawal = Withdrawal;
