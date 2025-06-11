const express = require("express");
require("express-async-errors");
const app = express();

app.set("view engine", "ejs");
app.use(require("body-parser").urlencoded({ extended: true }));

// secret word handling
let secretWord = "syzygy";

// CRUD functionality
app.get("/secretWord", (req, res) => {
  res.render("secretWord", { secretWord });
})

app.post("/secretWord", (req, res) => {
  secretWord = req.body.secretWord;
  res.redirect("/secretWord");
});

// middleware error handling
app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.log(err);
});

// create port
const port = process.env.PORT || 3000;

// start server
const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
