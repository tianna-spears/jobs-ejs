const authMiddleware = (req, res, next) => {
  if (!req.user) {
    req.flash("error", "You can't access this page before logon.");
    res.redirect("/sessions/logon");
  } else {
    next();
  }
};

module.exports = authMiddleware;
