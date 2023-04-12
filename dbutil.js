const { Pool, Client } = require("pg");
const connectionString =
  "postgresql://postgres:pUadyD1awDazDeakOAPL@containers-us-west-71.railway.app:6741/railway";

const pool = new Pool({
  connectionString,
});

const client = new Client({
  connectionString,
});
client.connect();

// const pool = new Pool({
//   url: process.env.DATABASE_URL,
//   user: "postgres",
//   host: "localhost",
//   database: "free-library",
//   password: "mynewpassword",
//   port: 5432,
// });

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
