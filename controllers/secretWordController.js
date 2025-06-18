const express = require('express')
const app = express()
const { csrf } = require('../middleware/csrf')

const getSecretWord = async (req, res) => {
  if (!req.session.secretWord) {
    req.session.secretWord = "syzygy";
  const token = csrf.token(req, res);
  res.render("secretWord", { secretWord: req.session.secretWord, _csrf: token });
}}

const createSecretWord=  (req, res) => {
  if (req.body.secretWord.toUpperCase()[0] == "P") {
    req.flash("error", "That word won't work!");
    req.flash("error", "You can't use words that start with p.");
  } else {
    req.session.secretWord = req.body.secretWord;
    req.flash("info", "The secret word was changed.");
  }
  res.redirect("/secretWord");
}

module.exports = {
    getSecretWord,
    createSecretWord
}