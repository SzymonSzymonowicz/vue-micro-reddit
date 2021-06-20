const assert = require("assert");

// DB connection config
require("dotenv").config();

const dbConnectionData = {
  host: process.env.PG_HOST || "127.0.0.1",
  port: process.env.PG_PORT || 5432,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
};

// Postgres client setup
const { Client } = require("pg");
const client = new Client(dbConnectionData);

// Repurposed to Postgres, taken from:
// https://itnext.io/how-to-share-a-single-database-connection-in-a-node-js-express-js-app-fcad4cbcb1e
let _db;

function initDb(callback) {
  if (_db) {
    console.warn("Trying to init DB again!");
    return callback(null, _db);
  }
  client.connect(connected);
  function connected(err, db) {
    if (err) {
      return callback(err);
    }
    console.log("DB initialized");
    _db = db;
    return callback(null, _db);
  }
}

function getDb() {
  assert.ok(_db, "Db has not been initialized. Please called init first.");
  return _db;
}

module.exports = {
  getDb,
  initDb,
};
