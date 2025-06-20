const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const passport = require("passport");
const passportInit = require("./passport/passportInit");
const cookieParser = require('cookie-parser')
const flash = require("connect-flash")
const csrf = require("host-csrf")

const secretWordRoutes = require('./routes/secretWordRoutes')
const sessionRoutes = require("./routes/sessionRoutes");
const authMiddleware = require("./middleware/auth");
const User = require('./models/User')

require("dotenv").config(); 
require("express-async-errors");

const app = express();

// store session data in Mongo as a session store
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "mySessions",
});
store.on("error", function (error) {
  console.log(error);
});

app.use(cookieParser(process.env.SESSION_SECRET));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// csrf configuration
let csrf_dev_mode = true;
if (app.get("env") === "production") {
  csrf_dev_mode = false;
  app.set("trust proxy", 1);
}

const csrf_options = {
  protected_operations: ["POST"],
  protected_content_types: [
    "application/x-www-form-urlencoded",
    "text/plain",
    "multipart/form-data",
  ],
  developer_mode: csrf_dev_mode,
  cookie_name: "csrfToken",
};

const csrf_middleware = csrf(csrf_options);
app.use(csrf_middleware);

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_default_secret',
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    secure: app.get('env') === 'production',
    httpOnly: true,
    sameSite: 'strict'
  }
}));



// middleware 
passportInit();
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())
app.set("view engine", "ejs");
app.use(require("./middleware/storeLocals"));

// routes
app.use("/sessions", sessionRoutes);
app.use("/secretWord", authMiddleware, secretWordRoutes)

app.get("/", (req, res) => {
  res.render("index");
});

// error handling
app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send(err.message);
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
