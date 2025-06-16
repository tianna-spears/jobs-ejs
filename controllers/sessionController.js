const User = require("../models/User");
const parseVErr = require("../util/parseValidationErrors");

const registerShow = (req, res) => {
  res.render("register");
};

const registerDo = async (req, res, next) => {
  const { name, email, password, password1 } = req.body;

  if (password !== password1) {
    req.flash("error", "The passwords entered do not match.");
    return res.render("register", { errors: req.flash("errors") });
  }

  try {
    const newUser = await User.create({ name, email, password });

    // 👇 This logs the user in (serializes the user into the session)
    req.login(newUser, (err) => {
      if (err) {
        console.error("❌ req.login error:", err)
        return next(err); // Could log or handle error more explicitly
      }
  console.log("✅ req.login succeeded.");
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
    return res.render("register", { errors: req.flash("errors") });
  }
};

const logoff = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
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