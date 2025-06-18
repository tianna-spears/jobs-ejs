const express = require('express')
const router = express.Router()
const { getSecretWord, createSecretWord } = require('../controllers/secretWordController')
const { csrf } = require('../middleware/csrf')

router.get("/", csrf, getSecretWord)

router.post("/",csrf, createSecretWord)

module.exports = router;