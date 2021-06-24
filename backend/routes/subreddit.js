const express = require("express");
const router = express.Router();
const getDb = require("../db").getDb;

router.get("/subreddits/:name/posts", async (req, res) => {
  const subName = req.params.name;

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
    WHERE s."name"='${subName}'
    ORDER BY p.creation_date DESC;
  `);
  return res.send(ret.rows);
});

// SELECT * FROM subreddit s WHERE s."name" LIKE '%th%';
router.get("/subreddits/search", async (req, res) => {
  const user = req.user;
  const name = req.query.name;

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
    ON s.id = res.id
    WHERE s."name" ILIKE '%${name}%';
    ;
  `);

  return res.send(ret.rows);
});

router.get("/subreddits/unique", async (req, res) => {
  let name = req.query.name;

  const ret = await getDb().query(`
    SELECT EXISTS(
      SELECT *
      FROM subreddit
      WHERE name='${name}'
    );
  `);

  let exists = ret.rows[0]?.exists;

  res.send(!exists);
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

router.post("/subreddits", async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.id;

  const query  = await getDb().query(`
    INSERT INTO subreddit VALUES (DEFAULT, '${name}', '${description}')
    RETURNING id;
  `).catch((err) => console.log(err));

  const subId = query.rows[0].id;

  var x = await getDb().query(`
    INSERT INTO subreddit_user VALUES
    (DEFAULT,${userId},${subId});
  `);

  var y = await getDb().query(`
    INSERT INTO subreddit_moderator VALUES (DEFAULT, ${userId}, ${subId});
  `).catch((err) => console.log(err));

  return res.sendStatus(200);
});

router.put("/subreddits/:id", async (req, res) => {
  const { name, description } = req.body;
  const id = req.params.id;

  await getDb().query(`
    UPDATE subreddit SET name='${name}', description='${description}'
    WHERE id=${id};
  `).catch((err) => {
    console.log(err);
    res.sendStatus(500);
  });

  return res.sendStatus(200);
});

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
