const mongoose = require("mongoose");
const config = require("config");

let conn;
const db_allusers = "mongodb+srv://vidlyuser:02231985143@clavmallcluster.oxbed.mongodb.net/allusers?retryWrites=true&w=majority";

try {
  conn = mongoose.createConnection(db_allusers, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  console.log(`Connected to ${db_allusers}...`);
} catch (err) {
  console.log("Unable to connect to MongoDB: allusers...");
}

module.exports = conn;
