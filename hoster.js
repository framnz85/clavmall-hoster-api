const country = require("./src/routers/address/countries");
const addiv1 = require("./src/routers/address/addiv1");
const addiv2 = require("./src/routers/address/addiv2");
const addiv3 = require("./src/routers/address/addiv3");
const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const express = require("express");
const app = express();

require("./src/db/address");

app.use(express.json());
app.use(country);
app.use(addiv1);
app.use(addiv2);
app.use(addiv3);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
