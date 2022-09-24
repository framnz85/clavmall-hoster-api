const conn = require("../../db/allusers");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const Joi = require("joi");

const estoreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  owner: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  country: {
    type: ObjectId,
    required: true,
    default: "60e865ce9333b731c74b232f",
  },
  email: String,
  mobile: String,
  password: String,
  urlname1: {
    type: String,
    unique: true,
  },
  urlname2: String,
  urlname3: String,
  showHomeCarousel: {
    type: Boolean,
    default: true,
  },
  showRandomItems: {
    type: Boolean,
    default: true,
  },
  showCategories: {
    type: Boolean,
    default: true,
  },
  showNewArrival: {
    type: Boolean,
    default: true,
  },
  showBestSeller: {
    type: Boolean,
    default: true,
  },
  headerColor: {
    type: String,
    default: "#009A57",
  },
  carouselColor: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "pending",
    enum: [
      "pending",
      "pause",
      "stop",
      "active",
    ],
  },
  categoryChange: {
    type: Number,
    default: 0,
  },
  subcatChange: {
    type: Number,
    default: 0,
  },
  parentChange: {
    type: Number,
    default: 0,
  },
  productChange: {
    type: Number,
    default: 0,
  },
  locationChange: {
    type: Number,
    default: 0,
  },
  estoreChange: {
    type: Number,
    default: 0,
  },
  imageStorage: {
    type: String,
    default: "clavmall",
    enum: [
      "clavmall",
      "cloudinary"
    ],
  },
  planType: {
    type: String,
    default: "plan-1",
    enum: [
      "plan-1",
      "plan-2",
      "plan-3"
    ]
  },
  endDate: Date,
  recurringCycle: {
    type: String,
    default: "One",
    enum: [
      "One",
      "Unlimited"
    ]
  },
  billingHistory: [
    {
      cycleId: String,
      cycleType: String,
      totalPrice: String,
      payment: String,
      payStatus: String,
      duration: Number,
      planId: String,
      subscriptionID: String,
    },
  ],
});

const Estore = conn.model("Estore", estoreSchema);

function validateEstore(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(user);
}

exports.Estore = Estore;
exports.validate = validateEstore;
