const express = require("express");
const app = express();

require('dotenv').config()

require("./startup/routes")(app);
require("./startup/prod")(app);

const port = process.env.PORT || 3900;
const server = app.listen(port, () =>
  console.log(`Listening on port ${port}...`)
);

module.exports = server;
