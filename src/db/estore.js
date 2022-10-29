const mongoose = require("mongoose");
const config = require("config");
const estoreid = require("./estoreid")

let conn={};
const db_estore = config.get("db_estore");
const db_estore_ext = config.get("db_estore_ext");

for (let i = 0; i < estoreid.length; i++) {
  try {
    conn[estoreid[i]] = mongoose.createConnection(`${db_estore}/estore-${estoreid[i]}${db_estore_ext}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log(`DB CONNECTED TO ${db_estore}/estore-${estoreid[i]}${db_estore_ext}`);
  } catch (err) {
    console.log(`DB CONNECTION ERR ${err}`);
  }
}

module.exports = conn;
