const express = require("express");
const router = express.Router();
const getDb = require("../db").getDb;

router.post("/subreddit", async (req, res) => {
  const ret = await getDb().query("SELECT * FROM subreddit;");
  return res.send(ret.rows);
});

router.get("/subreddit", async (req, res) => {
  const ret = await getDb().query("SELECT * FROM subreddit;");
  return res.send(ret.rows);
});

router.get("/subreddits", async (req, res) => {
  const user = req.user;
  const ret = await getDb().query(`
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

module.exports = router;
