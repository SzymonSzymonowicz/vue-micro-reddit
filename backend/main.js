const authenticationMiddleware = require("./middleware/authenticate");

// Express.js
const express = require("express");
const app = express();
app.use(express.json());

// CORS
const cors = require("cors");
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:8080",
  })
);

app.options("*", cors());

// Cookies
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");

app.use(cookieParser());
app.use(
  expressSession({
    secret: process.env.SECRET || "test",
    resave: false,
    saveUninitialized: false,
  })
);

// Pasport.js
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
app.use(passport.initialize());
app.use(passport.session());

// Urls, that don't require authentication
const allowUrl = ["/api/login", "/api/register", "/api/account/unique"];
app.use(authenticationMiddleware(allowUrl));

const getUserByEmailAndPassword = async (email, password) => {
  let ret = await getDb()
    .query(
      `SELECT * FROM reddit_user WHERE email='${email}' AND password='${password}';`
    )
    .catch((err) => {
      console.error(err);
      return done(err);
    });

  let user = ret.rows[0];
  return user;
};

// Passport.js config
const authenticateUser = async (email, password, done) => {
  let user = await getUserByEmailAndPassword(email, password);

  if (user) {
    done(null, {
      id: user.id,
      email: user.email,
      // password: user.password,
      isAuthenticated: true,
    });
  } else {
    done(null, false);
  }
};

// Passport-local config
passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
passport.deserializeUser(async (id, done) => {
  let ret = await getDb()
    .query(`SELECT * FROM reddit_user WHERE id=${id};`)
    .catch((err) => console.error(err));

  let user = ret.rows[0];

  done(null, {
    id: user.id,
    email: user.email,
  });
});
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Endpoints
app.post("/api/login", passport.authenticate("local"), (req, res) => {
  console.dir(req.user);
  res.send(req.user);
});

const apiPrefix = "/api";

const account = require("./routes/account");
app.use(apiPrefix, account);

const subreddit = require("./routes/subreddit");
app.use(apiPrefix, subreddit);


const initDb = require("./db").initDb;
const getDb = require("./db").getDb;
  
initDb(function (err) {
  if (err) {
    console.error("Connection error", err.stack)
    throw err;
  }

  const port = process.env.PORT || 5000;

  app.listen(port, () => {
    console.log(`API server listening at http://localhost:${port}`);
  });
})

