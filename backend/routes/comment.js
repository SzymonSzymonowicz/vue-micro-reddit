const express = require("express");
const router = express.Router();
const getDb = require("../db").getDb;

router.delete("/comments/:id", async (req, res) => {
  const comId = req.params.id;
  console.log("=============")
  console.log(comId)

  try {
    await getDb().query(`
      DELETE FROM comment c WHERE c.id = ${comId};
    `);
  } catch (err) {
    console.log(err);
  }

  return res.sendStatus(200);
});

router.post("/posts/:id/comments", async (req, res) => {
  const postId = req.params.id;
  const { content } = req.body;
  const userId = req.user.id;

  try {
    await getDb().query(`
      INSERT INTO comment VALUES (DEFAULT, '${content}', NULL, ${userId}, ${postId});
    `);
  } catch (err) {
    console.log(err);
  }

  return res.sendStatus(200);
});

module.exports = router;
