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
  let ret = await client
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
  let ret = await client
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
app.post("/api/subreddit", async (req, res) => {
  const ret = await client.query("SELECT * FROM subreddit;");
  return res.send(ret.rows);
});

app.get("/api/subreddit", async (req, res) => {
  const ret = await client.query("SELECT * FROM subreddit;");
  return res.send(ret.rows);
});

app.get("/api/account", async (req, res) => {
  const user = req.user;
  const ret = await client.query(
    `SELECT * FROM reddit_user WHERE id = ${user.id};`
  );
  return res.send(ret.rows[0]);
});

app.get("/api/subreddits", async (req, res) => {
  const user = req.user;
  const ret = await client.query(`
    SELECT s.id, s.name, s.description,
    CASE
      WHEN res.id IS NOT NULL THEN true::text
    ELSE false::text
      END "in"
    FROM subreddit s LEFT JOIN (
      SELECT s.id
      FROM subreddit s INNER JOIN subreddit_user su
      ON s.id = su.subreddit_id
      WHERE su.user_id = ${user.id}
    ) as res
    ON s.id = res.id;
  `);
  return res.send(ret.rows);
});

app.get("/api/account/unique", async (req, res) => {
  let email = req.query.email;

  const ret = await client.query(`
    SELECT EXISTS(
      SELECT *
      FROM reddit_user
      WHERE email='${email}'
    );
  `);

  let exists = ret.rows[0]?.exists;
  
  res.send(!exists);
})

app.post("/api/login", passport.authenticate("local"), (req, res) => {
  console.dir(req.user);
  res.send(req.user);
});

app.post("/api/register", async (req, res) => {
  const { email, nickname, password } = req.body;

  const ret = await client
    .query(
      `INSERT INTO reddit_user (email, nickname, password) VALUES ('${email}', '${nickname}', '${password}');`
    )
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });

  let user = ret.rows[0];
  res.send(user);
});

app.post("/api/logout", (req, res) => {
  req.logOut();
  res.sendStatus(200);
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
