const flash = require('connect-flash')

const storeLocals = (req, res, next) => {
  res.locals.user = req.user || null;

if (!res.locals.info) {
    res.locals.info = req.flash("info");
  }
  if (!res.locals.errors) {
    res.locals.errors = req.flash("error");
  }
  next();
};

module.exports = storeLocals;