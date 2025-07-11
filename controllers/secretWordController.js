const express = require('express');
const app = express()
const csrf = require("host-csrf");

const getSecretWord = async (req, res) => {
  if (!req.session.secretWord) {
    req.session.secretWord = "syzygy";
  }

  const _csrf = csrf.token(req, res);

  res.render("secretWord", { 
    secretWord: req.session.secretWord,
    _csrf,
  }) 
}

const createSecretWord=  (req, res) => {
  const createdWord= req.body.secretWord;

  if (createdWord && createdWord.toUpperCase().startsWith("P")) {
    req.flash("error", "That word won't work!");
    req.flash("error", "You can't use a word that starts with p.");
  } 
  else {
    req.session.secretWord = createdWord
    req.flash("info", "The secret word was changed.");
  }
  res.redirect("/secretWord");
}

module.exports = {
    getSecretWord,
    createSecretWord
}