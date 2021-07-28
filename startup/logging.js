// const winston = require("winston");
// require("winston-mongodb");
require("express-async-errors");
// const config = require("config");

module.exports = function () {
  // winston.handleExceptions(
  //   new winston.transports.File({ filename: "uncaughtExceptions.log" })
  // );
  // process.on("unhandledRejection", (ex) => {
  //   throw ex;
  // });
  // winston.add(winston.transports.File, { filename: "logfile.log" });
  // const dbServer = config.get("dbServer");
  // winston.add(winston.transports.MongoDB, {
  //   db: dbServer + "allerrors?retryWrites=true&w=majority",
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  //   useFindAndModify: false,
  //   useCreateIndex: true,
  // });
};
