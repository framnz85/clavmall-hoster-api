function isAdmin(req, res, next) {
  if (!req.user.isAdmin) return res.status(403).send("Need admin privileges.");
  next();
}

module.exports = isAdmin;
