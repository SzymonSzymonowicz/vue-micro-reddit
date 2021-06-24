const express = require("express");
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

router.get("/posts/:id", async (req, res) => {
  const postId = req.params.id;

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
    WHERE p.id = ${postId};
  `);

  return res.send(ret.rows[0]);
});

router.get("/posts/:id/comments", async (req, res) => {
  const postId = req.params.id;

  const ret = await getDb().query(`
    SELECT c.id, c.content, ru.nickname as "author", c.post_id as "postId"
    FROM "comment" c
    INNER JOIN post p
    ON c.post_id = p.id
    INNER JOIN reddit_user ru
    ON c.user_id = ru.id
    WHERE p.id = ${postId};
  `);

  return res.send(ret.rows);
});

router.get("/posts/:id/votes/sum", async (req, res) => {
  const user = req.user;
  const postId = req.params.id;

  const ret = await getDb().query(`
    SELECT COALESCE(SUM(pv.vote), 0) as sum
    FROM post_vote pv
    WHERE pv.post_id = ${postId};
  `);

  return res.send(ret.rows[0].sum);
});

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
    // return res.status(400).send("You have already voted on this post");
    await getDb().query(`
      UPDATE post_vote SET vote=${vote} WHERE user_id=${userId} AND post_id=${postId};
    `);
  } else {
    const insertQuerry = await getDb().query(`
      INSERT INTO post_vote VALUES (DEFAULT, ${vote}, ${userId}, ${postId});
    `);
  }

  return res.sendStatus(200);
});

router.get("/posts/:id/my-vote", async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;

  const ret = await getDb().query(`
    SELECT vote
    FROM post_vote
    WHERE post_id=${postId} 
      AND user_id=${userId};
  `);

  const hasVoted = ret.rows[0];
  console.log("hasVoted: " + hasVoted);

  if (!hasVoted) {
    return res.send("none");
  }
  
  const vote = hasVoted.vote;
  
  if (vote === 1) {
    return res.send("upvote");
  } else {
    return res.send("downvote");
  }
});

// { title, content, imagePath, videoUrl, subredditId }
router.post("/posts", async (req, res) => {
  const userId = req.user.id;
  const { title, content, imagePath, videoUrl, subredditId } = req.body;

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
});

router.delete("/posts/:id", async (req, res) => {
  await getDb().query(
    `DELETE
         FROM post_vote
         WHERE post_id = '${req.params.id}'`
  );

  await getDb().query(`DELETE FROM comment WHERE post_id = '${req.params.id}'`);

  await getDb().query(
    `DELETE
         FROM post
         WHERE id = '${req.params.id}'`
  );
  return res.send();
});

module.exports = router;