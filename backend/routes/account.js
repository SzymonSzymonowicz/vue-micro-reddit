const express = require("express");
const router = express.Router();
const getDb = require("../db").getDb;

router.get("/account", async (req, res) => {
  const user = req.user;
  const ret = await getDb().query(
    `SELECT * FROM reddit_user WHERE id = ${user.id};`
  );
  return res.send(ret.rows[0]);
});

router.get("/account/unique", async (req, res) => {
  let email = req.query.email;

  const ret = await getDb().query(`
    SELECT EXISTS(
      SELECT *
      FROM reddit_user
      WHERE email='${email}'
    );
  `);

  let exists = ret.rows[0]?.exists;

  res.send(!exists);
});

router.post("/register", async (req, res) => {
  const { email, nickname, password } = req.body;
  console.log(req.body);

  const ret = await getDb()
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

router.post("/logout", (req, res) => {
  req.logOut();
  res.sendStatus(200);
});

module.exports = router;
