const { Pool, Client } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "free-library",
  password: "mynewpassword",
  port: 5432,
});

// Create a custom query function that returns a promise with the query results
const query = function (text, params) {
  return new Promise((resolve, reject) => {
    pool.query(text, params, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};

module.exports = {
  pool,
  query,
};
