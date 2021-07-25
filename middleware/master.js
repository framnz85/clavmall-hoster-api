function isMaster(req, res, next) {
  if (!req.user.isMaster)
    return res.status(403).send("Need master privileges.");
  next();
}

module.exports = isMaster;
