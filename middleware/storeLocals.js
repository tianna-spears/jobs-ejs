const { token } = require("host-csrf");

const storeLocals = (req, res, next) => {
  try {
    res.locals.csrfToken = token(req, res);
    console.log("Generated CSRF token:", res.locals.csrfToken);
  } catch (err) {
    res.locals.csrfToken = null;
  }
  res.locals.user = req.user;
  res.locals.info = req.flash("info");
  res.locals.errors = req.flash("error");
  next();
};

module.exports = storeLocals;
