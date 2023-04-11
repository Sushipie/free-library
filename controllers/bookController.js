const { pool, query } = require("../dbutil");

//export the functions to be used in the routes
//import validation functions
const { body, validationResult } = require("express-validator");

module.exports.getBook = function (req, res, next) {
  var bookArray = [];
  var authorArray = [];
  var genreArray = [];

  //get theh books and their authors and genres and send both author and genres names and ids to the bookList.ejs view

  pool.query(
    "SELECT books.id, books.title, books.description, books.download_link,  books.author_id, books.genre_id, authors.name AS author, genres.name AS genre FROM books INNER JOIN authors ON books.author_id = authors.id INNER JOIN genres ON books.genre_id = genres.id",
    (err, result) => {
      if (err) {
        console.log(err);
      }
      for (let i = 0; i < result.rows.length; i++) {
        bookArray.push(result.rows[i]);
      }
      console.log(bookArray);
      res.render("bookList", {
        title: "Books",
        bookArray,
      });
    }
  );
};

const validate = (req, res, next) => {
  return new Promise((resolve, reject) => {
    body("title", "Title must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape()(req, res, () => {
      resolve();
    });
  });
};

module.exports.createGet = function (req, res, next) {
  //send the bookForm.ejs view
  res.render("bookform", { title: "Add a book" });
};

module.exports.createPost = async function (req, res, next) {
  //if the author or genre does not exist, add it to the database

  validate(req, res, next);

  const { author, genre } = req.body;

  //check if author are genere are valid

  const authorname = await query("SELECT id FROM authors WHERE name = $1", [
    author,
  ]);

  if (authorname.rows.length == 0) {
    pool.query(
      "INSERT INTO authors (name) VALUES ($1)",
      [author],
      (err, result) => {
        if (err) {
          console.log(err);
        }
      }
    );
  }

  const generename = await query("SELECT id FROM genres WHERE name = $1", [
    genre,
  ]);

  if (generename.rows.length == 0) {
    pool.query(
      "INSERT INTO genres (name) VALUES ($1)",
      [genre],
      (err, result) => {
        if (err) {
          console.log(err);
        }
      }
    );
  }

  //add the book. if the author or genre does not exist, it will be added to the database
  const { title, description, download_link } = req.body;
  pool.query(
    "INSERT INTO books (title, description, download_link, author_id, genre_id) VALUES ($1, $2, $3, (SELECT id FROM authors WHERE name = $4), (SELECT id FROM genres WHERE name = $5))",
    [title, description, download_link, author, genre],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      module.exports.getBook(req, res, next);
      console.log("Book added");
    }
  );
};

// GET a single book by id
module.exports.getBookById = function (req, res, next) {
  const id = req.params.id;
  pool.query(
    "SELECT books.id, books.title, books.description, books.download_link, authors.name AS author, genres.name AS genre FROM books INNER JOIN authors ON books.author_id = authors.id INNER JOIN genres ON books.genre_id = genres.id WHERE books.id = $1",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result.rows);
    }
  );
};

/* Add a book to the database with fields
  (title, description, download_link, author_id, genre_id).
  The request will be a json object with the fields. */

/* Update a book by id. The request will be a json object with the available fields. */
module.exports.update = function (req, res, next) {
  const id = req.params.id;
  const { title, description, download_link, author_id, genre_id } = req.body;
  pool.query(
    "UPDATE books SET title = $1, description = $2, download_link = $3, author_id = $4, genre_id = $5 WHERE id = $6",
    [title, description, download_link, author_id, genre_id, id],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send("Book updated");
    }
  );
};

module.exports.delete = function (req, res, next) {
  const id = req.params.id;
  pool.query("DELETE FROM books WHERE id = $1", [id], (err, result) => {
    if (err) {
      console.log(err);
    }
    module.exports.getBook(req, res, next);
    console.log("Book deleted");
  });
};
