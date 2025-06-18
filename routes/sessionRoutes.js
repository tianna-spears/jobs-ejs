const express = require("express");
const passport = require("passport");
const router = express.Router();
// const {csrfMiddleware, csrf} = require('../middleware/csrf')

const {
  logonShow,
  registerShow,
  registerDo,
  logoff,
} = require("../controllers/sessionController");

router.route("/register").get(registerShow).post(registerDo);

router
  .route("/logon")
  .get(logonShow)
  .post(passport.authenticate("local", {
      successRedirect: "/secretWord",
      failureRedirect: "/sessions/logon",
      failureFlash: true,
    }),
    (req, res) => {
      res.redirect("/");
    }
  );
router.route("/logoff").post(logoff);

module.exports = router;
