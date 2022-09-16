const mongoose = require("mongoose");
const config = require("config");

let conn;
const db_address = "mongodb+srv://vidlyuser:02231985143@clavmallcluster.oxbed.mongodb.net/address?retryWrites=true&w=majority";

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
