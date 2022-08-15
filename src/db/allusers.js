const mongoose = require("mongoose");

let conn;
const db_allusers = process.env.ALLUSERS_DATABASE;

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
