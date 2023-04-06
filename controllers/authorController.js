const { Pool, Client } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "free-library",
  password: "mynewpassword",
  port: 5432,
});

//export the functions to be used in the routes

// GET all authors

module.exports.index = function (req, res, next) {
  var authorArray = [];

  pool.query("SELECT * FROM authors", (err, result) => {
    if (err) {
      console.log(err);
    }
    for (let i = 0; i < result.rows.length; i++) {
      authorArray.push(result.rows[i]);
    }
    console.log(authorArray);
    res.render("authorList", {
      title: "Authors",
      authorArray,
    });
  });

  // pool.query("SELECT * FROM authors", (err, result) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   res.send(result.rows);
  // });
};

// GET a single author by id
module.exports.getAuthorById = function (req, res, next) {
  const id = req.params.id;
  pool.query("SELECT * FROM authors WHERE id = $1", [id], (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result.rows);
  });
};

/* Add an author to the database with fields
    (name)
    The request will be a json object with the fields. */
module.exports.create = function (req, res, next) {
  const { name } = req.body;
  pool.query(
    "INSERT INTO authors (name) VALUES ($1)",
    [name],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send("Author added");
    }
  );
};

/* Update an author by id. The request will be a json object with the available fields. */
module.exports.update = function (req, res, next) {
  const id = req.params.id;
  const { name } = req.body;
  pool.query(
    "UPDATE authors SET name = $1 WHERE id = $2",
    [name, id],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send("Author updated");
    }
  );
};

/* Delete an author by id */
module.exports.delete = function (req, res, next) {
  const id = req.params.id;
  pool.query("DELETE FROM authors WHERE id = $1", [id], (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send("Author deleted");
  });
};
