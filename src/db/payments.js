const mongoose = require("mongoose");

let conn;
const db_payments = process.env.PAYMENTS_DATABASE;

try {
  conn = mongoose.createConnection(db_payments, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  console.log(`Connected to ${db_payments}...`);
} catch (err) {
  console.log("Unable to connect to MongoDB: allusers...");
}

module.exports = conn;
