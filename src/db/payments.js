const mongoose = require("mongoose");
let conn;

try {
  conn = mongoose.createConnection(process.env.PAYMENTS_DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  console.log(`Connected to ${process.env.PAYMENTS_DATABASE}...`);
} catch (err) {
  console.log("Unable to connect to MongoDB: allusers...");
}

module.exports = conn;
