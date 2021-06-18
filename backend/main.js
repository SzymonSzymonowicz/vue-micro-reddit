// Express.js
const express = require("express");
const app = express();
app.use(express.json());

// Cookies
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");

// Pasport.js
const passport = require("passport");
const passportLocal = require("passport-local");
app.use(passport.initialize());
app.use(passport.session());

// Passport.js config
const validateUser = async (username, password, done) => {
  let ret = await client
    .query(
      `SELECT * FROM reddit_user WHERE email='${username}' AND password='${password}';`
    )
    .catch((err) => console.error(err));

  console.log(ret.rows[0])
  
  let user = ret.rows[0];

  // if (username === "tomek" && password === "tajne") {
  if (user) {
    done(null, {
      id: user.id,
      username: user.email,
      password: user.password,
    });
  } else {
    done(null, null);
  }
};

// Passport-local config
passport.use(new passportLocal.Strategy(validateUser));
passport.deserializeUser(async (id, done) => {
  let ret = await client
  .query(
    `SELECT * FROM reddit_user WHERE id=${id};`
  )
  .catch((err) => console.error(err));

  let user = ret.rows[0];
  
  // User.findById(id, function (err, user) {
    // done(err, user);
  // });
  // null is error var

  done(null, {
    id: user.id,
    username: user.username,
    password: user.password,
  });
});
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Endpoints
app.get("/api/subreddit", async (req, res) => {
  let ret = await client.query("SELECT * FROM subreddit;");
  res.send(ret.rows);
});

app.post("/api/login", passport.authenticate("local"), (req, res) => {
  console.dir(req.user);
  res.send(req.user);
});

// DB connection config
require("dotenv").config();
const dbConnectionData = {
  host: process.env.PG_HOST || "127.0.0.1",
  port: process.env.PG_PORT || 5432,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
};

console.log("Connection parameters: ");
console.log(dbConnectionData);

// Postgres client setup
const { Client } = require("pg");
const client = new Client(dbConnectionData);

client
  .connect()
  .then(async () => {
    console.log("Connected to PostgreSQL");
    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(`API server listening at http://localhost:${port}`);
    });
  })
  .catch((err) => console.error("Connection error", err.stack));
