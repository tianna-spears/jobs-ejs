const express = require('express')
const router = express.Router()
const { getSecretWord, createSecretWord } = require('../controllers/secretWordController')
// const { csrf } = require('../middleware/csrf')

router.get("/", getSecretWord)

router.post("/", createSecretWord)

module.exports = router;