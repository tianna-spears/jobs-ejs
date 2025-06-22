const flash = require('connect-flash')
const { token } = require("host-csrf");

const storeLocals = (req, res, next) => {
  try {
    res.locals.csrfToken = token(req, res);
    console.log("Generated CSRF token:", res.locals.csrfToken);
  } catch (err) {
    res.locals.csrfToken = null;
  }

if (!res.locals.info) {
    res.locals.info = req.flash("info");
  }
  if (!res.locals.errors) {
    res.locals.errors = req.flash("error");
  }
  next();
};

module.exports = storeLocals;