const { Pool, Client } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "free-library",
  password: "mynewpassword",
  port: 5432,
});

//export the functions to be used in the routes

//Get all genres

module.exports.index = function (req, res, next) {
  pool.query("SELECT * FROM genres", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result.rows);
  });
};

//Get a single genre by id
module.exports.getGenreById = function (req, res, next) {
  const id = req.params.id;
  pool.query("SELECT * FROM genres WHERE id = $1", [id], (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result.rows);
  });
};

/* Add a genre to the database with fields
    (name)
    The request will be a json object with the fields. */
module.exports.create = function (req, res, next) {
  const { name } = req.body;
  pool.query("INSERT INTO genres (name) VALUES ($1)", [name], (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send("Genre added");
  });
};

/* Update a genre by id. The request will be a json object with the available fields. */
module.exports.update = function (req, res, next) {
  const id = req.params.id;
  const { name } = req.body;
  pool.query(
    "UPDATE genres SET name = $1 WHERE id = $2",
    [name, id],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send("Genre updated");
    }
  );
};

/* Delete a genre by id */
module.exports.delete = function (req, res, next) {
  const id = req.params.id;
  pool.query("DELETE FROM genres WHERE id = $1", [id], (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send("Genre deleted");
  });
};
