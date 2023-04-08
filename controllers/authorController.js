const { pool, query } = require("../dbutil");

// GET all authors
module.exports.index = function (req, res, next) {
  var authorArray = [];

  //get all the authors once and join their books

  pool.query(
    "SELECT authors.id, authors.name, books.title FROM authors LEFT JOIN books ON authors.id = books.author_id",

    (err, result) => {
      if (err) {
        console.log(err);
      }
      for (let i = 0; i < result.rows.length; i++) {
        let author = authorArray.find(
          (author) => author.id == result.rows[i].id
        );
        if (author) {
          author.books.push(result.rows[i].title);
        } else {
          authorArray.push({
            id: result.rows[i].id,
            name: result.rows[i].name,
            books: [result.rows[i].title],
          });
        }
      }
      console.log(authorArray);
      res.render("authorList", {
        title: "Authors",
        authorArray,
      });
    }
  );
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
  //check if author has books by checking if author_id is in books table and if it is, return error
  const id = req.params.id;
  pool.query(
    "SELECT * FROM books WHERE author_id = $1",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result.rows.length > 0) {
        res.redirect("/catalog/authors");
        console.log("Author has books");
      } else {
        pool.query("DELETE FROM authors WHERE id = $1", [id], (err, result) => {
          if (err) {
            console.log(err);
          }
          res.redirect("/catalog/authors");
          console.log("Author deleted");
        });
      }
    }
  );
};
