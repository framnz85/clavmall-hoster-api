const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");
const config = require("config");

winston.handleExceptions(
  new winston.transports.Console({
    colorize: true,
    prettyPrint: true,
  }),
  new winston.transports.File({ filename: "uncaughtExceptions.log" })
);

process.on("unhandledRejection", (ex) => {
  throw ex;
});

winston.add(winston.transports.File, { filename: "logfile.log" });
const dbServer = config.get("dbServer");
winston.add(winston.transports.MongoDB, {
  db: dbServer + "allerrors?retryWrites=true&w=majority",
  level: "info",
});
