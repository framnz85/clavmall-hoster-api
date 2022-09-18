const mongoose = require("mongoose");
const config = require("config");

let conn;
const db_payments = config.get("db_payments");

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
