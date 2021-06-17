const express = require("express");
const app = express();
app.use(express.json());

app.get("/api/subreddit", async (req, res) => {
  let ret = await client.query("SELECT * FROM subreddit;");
  return res.send(ret.rows);
});


require("dotenv").config();
const dbConnectionData = {
  host: process.env.PG_HOST || "127.0.0.1",
  port: process.env.PG_PORT || 5432,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD
};

const { Client } = require("pg");
const client = new Client(dbConnectionData);

console.log("Connection parameters: ");
console.log(dbConnectionData);
client
  .connect()
  .then(async () => {
    console.log("Connected to PostgreSQL");
    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(`API server listening at http://localhost:${port}`);
    });
  })
  .catch(err => console.error("Connection error", err.stack));

