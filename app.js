const express = require("express");
require("express-async-errors");
const app = express();
require("dotenv").config(); 
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const url = process.env.MONGO_URI;
const passport = require("passport");
const passportInit = require("./passport/passportInit");
const secretWordRoutes = require('./routes/secretWordRoutes')
const sessionRoutes = require("./routes/sessionRoutes");
const authMiddleware = require("./middleware/auth");
const User = require('./models/User')

// store session data in Mongo as a session store
const store = new MongoDBStore({
  uri: url,
  collection: "mySessions",
});
store.on("error", function (error) {
  console.log(error);
});

const sessionParms = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: "strict" },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sessionParms.cookie.secure = true; // serve secure cookies
}

// middleware 
passportInit();
app.use(session(sessionParms));
app.set("view engine", "ejs");
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(require("connect-flash")());

// passport-local library
app.use(passport.initialize());
app.use(passport.session());
app.use(require("./middleware/storeLocals"));


// routes
app.get("/", async (req, res) => {
  console.log("👤 req.user:", req.user);
  console.log("🧠 req.session:", req.session);

  if (!req.user) {
    // just for test: manually set
    const testUser = await User.findOne(); // grab first user
    req.login(testUser, (err) => {
      if (err) console.error("Login error:", err);
      else console.log("✅ Manual login worked.");
    });
  }

  res.render("index", { user: req.user });
});




app.use("/sessions", sessionRoutes);
app.use("/secretWord", authMiddleware, secretWordRoutes)

// error handling
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
    await require("./db/connect")(process.env.MONGO_URI);
    console.log('Connected to MongoDB database!') 
    
    app.listen(port, () =>
    console.log(`Server is listening on port ${port}...`)
    );

  } catch (error) {
    console.log('Error connecting to MongoDB', error)
  }

};

start();
