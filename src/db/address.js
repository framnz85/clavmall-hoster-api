const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://vidlyuser:02231985143@clavmallcluster.oxbed.mongodb.net/address?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("Could not connect to MongoDB...", err));
