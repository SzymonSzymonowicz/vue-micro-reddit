const express = require("express");
const router = express.Router();
const getDb = require("../db").getDb;

router.get("/subreddits/:name/posts", async (req, res) => {
  const subName = req.params.name;

  const ret = await getDb().query(`
    SELECT p.*
    FROM post p
    INNER JOIN subreddit s
    ON p.subreddit_id = s.id
    WHERE s."name"='${subName}';
  `);
  return res.send(ret.rows);
});

router.get("/subreddits/:name", async (req, res) => {
  const subName = req.params.name;
  const ret = await getDb().query(
    `SELECT * FROM subreddit s WHERE s.name='${subName}';`
  );
  return res.send(ret.rows[0]);
});

router.get("/subreddits/:name/is-moderator", async (req, res) => {
  const user = req.user;
  const subName = req.params.name;

  const ret = await getDb().query(`
    SELECT EXISTS(
      SELECT * 
      FROM subreddit_moderator sm
      INNER JOIN subreddit s
      ON s.id = sm.subreddit_id
      WHERE s.name='${subName}' AND sm.user_id=${user.id}
    );
  `).catch(err => console.log(err));

  let isModerator = ret.rows[0]?.exists;

  return res.send(isModerator);
})

router.get("/subreddits/:name/is-in", async (req, res) => {
  const user = req.user;
  const subName = req.params.name;

  const ret = await getDb().query(`
    SELECT EXISTS(
      SELECT * 
      FROM subreddit_user su
      INNER JOIN subreddit s
      ON s.id = su.subreddit_id
      WHERE s.name='${subName}' AND su.user_id=${user.id}
    );
  `).catch(err => console.log(err));

  let isIn = ret.rows[0]?.exists;

  return res.send(isIn);
})




router.get("/subreddits", async (req, res) => {
  const user = req.user;
  const ret = await getDb().query(`
    SELECT s.id, s.name, s.description,
    CASE
      WHEN res.id IS NOT NULL THEN true::text
    ELSE false::text
      END "isIn"
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

router.post("/subreddits/:subId/join", async (req, res) => {
  const userId = req.user.id;
  const subId = req.params.subId;

  if (!(userId && subId)) {
    return res.sendStatus(400);
  }

  const ret = await getDb().query(`
    INSERT INTO subreddit_user VALUES
    (DEFAULT,${userId},${subId});
  `);

  return res.sendStatus(200);
});

module.exports = router;
