const User = require("../models/User");
const parseVErr = require("../util/parseValidationErrors");
const flash = require('connect-flash')

const registerShow = (req, res) => {
  res.render("register", { errors: [] });
};

const registerDo = async (req, res, next) => {
  console.log('CSRF cookie:', req.cookies['csrfToken']);
  console.log('Form token:', req.body._csrf);
  const { name, email, password, password1 } = req.body;
  if (password !== password1) {
    req.flash("error", "The passwords entered do not match.");
    return res.render("register", { errors: req.flash("error") });
  }
  try {
    const newUser = await User.create({ name, email, password });
    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }
    return res.redirect("/secretWord");
    });

  } catch (e) {
    if (e.constructor.name === "ValidationError") {
      parseVErr(e, req);
    } else if (e.name === "MongoServerError" && e.code === 11000) {
      req.flash("error", "That email address is already registered.");
    } else {
      return next(e);
    }
    return res.render("register", { errors: req.flash("error") });
  }
};


const logoff = (req, res) => {
console.log("CSRF token in request:", req.body._csrf);  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
    console.log(req.body._csrf)
    res.redirect("/");
  });
};


const logonShow = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }

  res.render("logon", {
    errors: req.flash("error"),
    info: req.flash("info"),
  });
};

module.exports = {
  registerShow,
  registerDo,
  logoff,
  logonShow
};