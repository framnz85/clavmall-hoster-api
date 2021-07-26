const ObjectId = require("mongoose").Types.ObjectId;

module.exports = (requestId) => {
  return (req, res, next) => {
    if (!ObjectId.isValid(req.params[requestId]))
      return res
        .status(404)
        .send(`id: ${req.params[requestId]} is not a valid ObjectId`);

    next();
  };
};
