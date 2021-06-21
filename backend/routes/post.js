const express = require('express');
const router = express.Router();
const getDb = require("../db").getDb;

router.get("/posts/my", async (req, res) => {
  const user = req.user;
  const sortBy = req.query.sortBy;

  const orderBy = sortBy === "date" ? "ORDER BY p.creation_date DESC;" : ";";

  const ret = await getDb().query(`
    SELECT p.id,
    s."name" as "subreddit",
    ru.nickname as "author",
    p.title,
    p."content",
    p.creation_date as "creationDate",
    p.image_path as "imagePath",
    p.video_url as "videoUrl"
    FROM post p 
      INNER JOIN subreddit s
      INNER JOIN subreddit_user su ON su.subreddit_id = s.id
      ON p.subreddit_id = s.id AND su.user_id = ${user.id}
      INNER JOIN reddit_user ru ON ru.id = p.user_id
    ${orderBy} 
  `);
  return res.send(ret.rows);
});

router.get("/posts/search", async (req, res) => {
  const content = req.query.content;

  const ret = await getDb().query(`
    SELECT p.id,
    s."name" as "subreddit",
    ru.nickname as "author",
    p.title,
    p."content",
    p.creation_date as "creationDate",
    p.image_path as "imagePath",
    p.video_url as "videoUrl"
    FROM post p 
      INNER JOIN subreddit s
      ON p.subreddit_id = s.id
      INNER JOIN reddit_user ru ON ru.id = p.user_id
    WHERE p.content ILIKE '%${content}%';
  `);
  return res.send(ret.rows);
});




router.get("/posts/:id/votes", async (req, res) => {
  const user = req.user;
  const postId = req.params.id;

  const ret = await getDb().query(`
    SELECT COALESCE(SUM(pv.vote), 0) as sum
    FROM post_vote pv
    WHERE pv.post_id = ${postId};
  `);

  return res.send(ret.rows[0].sum);
})

router.post("/posts/:id/votes", async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;
  const vote = req.body.vote >= 1 ? 1 : -1;

  const hasVotedQuerry = await getDb().query(`
    SELECT EXISTS(
      SELECT *
      FROM post_vote pv
      WHERE pv.post_id=${postId} 
        AND pv.user_id=${userId}
    );
  `);

  const hasVoted = hasVotedQuerry.rows[0].exists;
  
  if (hasVoted) {
    return res.status(400).send("You have already voted on this post");
  }

  const insertQuerry = await getDb().query(`
    INSERT INTO post_vote VALUES (DEFAULT, ${vote}, ${userId}, ${postId});
  `);
  return res.sendStatus(200);
})

router.get("/posts/:id/has-voted", async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;

  const ret = await getDb().query(`
    SELECT EXISTS(
      SELECT *
      FROM post_vote pv
      WHERE pv.post_id=${postId} 
        AND pv.user_id=${userId}
    );
  `);

  const hasVoted = ret.rows[0].exists;

  return res.send(hasVoted);
})

// { title, content, imagePath, videoUrl, subredditId }
router.post("/posts", async (req, res) => {
  const userId = req.user.id;
  const { title, content, imagePath, videoUrl, subredditId } = req.body;

  console.log("==================================")
  console.log(req.body);
  console.log("==================================")

  const insertPost = await getDb().query(`
    INSERT INTO post VALUES
    (
      DEFAULT,
      '${title}',
      '${content}', 
      '${imagePath}', 
      '${videoUrl}', 
      NOW(),
      ${subredditId}, 
      ${userId}
    );
  `);

  return res.sendStatus(200);
})

module.exports = router;