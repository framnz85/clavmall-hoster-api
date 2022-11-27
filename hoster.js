const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { readdirSync } = require("fs");
require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));
app.use(cors());

readdirSync("./src/routers").map((route) =>
  app.use("/", require("./src/routers/" + route))
);

const port = process.env.PORT || 3900;
app.listen(port, () => console.log(`Server is running on port ${port}`));
