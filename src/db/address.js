const mongoose = require("mongoose");
const config = require("config");

let conn;
const db_address = config.get("db_address");

try {
  conn = mongoose.createConnection(db_address, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  console.log(`Connected to ${db_address}...`);
} catch (err) {
  console.log("Unable to connect to MongoDB: address...");
}

module.exports = conn;
