const mongoose = require("mongoose");

let conn;

try {
  conn = mongoose.createConnection(
    "mongodb+srv://vidlyuser:02231985143@clavmallcluster.oxbed.mongodb.net/allusers?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  );
  console.log("Connected to MongoDB: allusers...");
} catch (err) {
  console.log("Unable to connect to MongoDB...");
}

module.exports = conn;
