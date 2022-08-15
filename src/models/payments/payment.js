const conn = require("../../db/payments");
const mongoose = require("mongoose");
const Joi = require("joi");

const paymentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  category: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
    enum: [
      "Credit/Debit Card",
      "Bank Transfer",
      "Online Banking",
      "Remittance",
      "Online Payment",
      "Cash on Delivery",
      "Cryptocurrency",
    ],
  },
});

const Payment = conn.model("Payment", paymentSchema);

function validatePayment(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    category: Joi.string().min(2).max(255).required(),
  });

  return schema.validate(user);
}

exports.Payment = Payment;
exports.validate = validatePayment;
