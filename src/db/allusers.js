const mongoose = require("mongoose");
const config = require("config");

let conn;
const dbServer = config.get("dbServer");

try {
  conn = mongoose.createConnection(
    dbServer + "allusers?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  );
  console.log("Connected to MongoDB: allusers...");
} catch (err) {
  console.log("Unable to connect to MongoDB: allusers...");
}

module.exports = conn;
