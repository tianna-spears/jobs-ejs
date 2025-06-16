const storeLocals = (req, res, next) => {
  console.log("📦 Session:", req.session);
  console.log("👤 User on req.user:", req.user);

  res.locals.user = req.user || null;
  res.locals.info = req.flash("info");
  res.locals.errors = req.flash("error");
  next();
};


module.exports = storeLocals;