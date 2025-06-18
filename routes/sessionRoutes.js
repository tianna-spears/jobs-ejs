const express = require("express");
const passport = require("passport");
const router = express.Router();
const {csrfMiddleware, csrf} = require('../middleware/csrf')

const {
  logonShow,
  registerShow,
  registerDo,
  logoff,
} = require("../controllers/sessionController");

router.route("/register").get(registerShow).post(csrf,registerDo);

router
  .route("/logon")
  .get(csrfMiddleware, logonShow)
  .post(csrfMiddleware, passport.authenticate("local", {
      successRedirect: "/secretWord",
      failureRedirect: "/sessions/logon",
      failureFlash: true,
    }),
    (req, res) => {
      res.redirect("/");
    }
  );
router.route("/logoff").post(csrf, logoff);

module.exports = router;
