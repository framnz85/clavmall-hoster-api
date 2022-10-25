const mongoose = require("mongoose");
const config = require("config");

let conn;
const db_ogt = config.get("db_ogt");

try {
  conn = mongoose.createConnection(db_ogt, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  console.log(`Connected to ${db_ogt}...`);
} catch (err) {
  console.log("Unable to connect to MongoDB: allusers...");
}

module.exports = conn;
