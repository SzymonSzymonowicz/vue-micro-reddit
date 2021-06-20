const express = require('express');
const router = express.Router();
const getDb = require("../db").getDb;

// router.get("/account", async (req, res) => {
//   const user = req.user;
//   const ret = await getDb().query(
//     `SELECT * FROM reddit_user WHERE id = ${user.id};`
//   );
//   return res.send(ret.rows[0]);
// });

module.exports = router;