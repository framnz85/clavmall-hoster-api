function isModerator(req, res, next) {
  if (!req.user.isModerator)
    return res.status(403).send("Need moderator privileges.");
  next();
}

module.exports = isModerator;
