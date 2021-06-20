const express = require('express');
const router = express.Router();
const getDb = require("../db").getDb;

router.get("/posts/my", async (req, res) => {
  const user = req.user;
  const ret = await getDb().query(
    `SELECT p.id,
    p.subreddit_id,
    p.user_id as "authorId",
    p.title,
    p."content",
    p.creation_date,
    p.image_path,
    p.video_url
    FROM post p 
      INNER JOIN subreddit s
      INNER JOIN subreddit_user su ON su.subreddit_id = s.id
      ON p.subreddit_id = s.id AND su.user_id = ${user.id};`
  );
  return res.send(ret.rows);
});

module.exports = router;