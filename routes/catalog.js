var express = require("express");
var router = express.Router();

//import validation functions
const { body, validationResult } = require("express-validator");

const bookController = require("../controllers/bookController");
const authorController = require("../controllers/authorController");
const genreController = require("../controllers/genreController");

// // GET all books and their authors and genres
router.get("/books", bookController.getBook);

/* Add a book to the database with fields
 (title, description, download_link, author_id, genre_id). 
 The request will be a json object with the fields. */
router.get("/books/create", bookController.createGet);

router.post(
  "/books/create",
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("download_link", "Download link must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("genre", "Genre must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      //store the error messages in an array
      var errorsArray = [];
      for (let i = 0; i < errors.array().length; i++) {
        errorsArray.push(errors.array()[i].msg);
      }
      console.log(errorsArray);
      res.render("bookForm", {
        title: "Add a book",
        errors: errorsArray,
      });
    } else {
      bookController.createPost(req, res, next);
    }
  }
);

//get a book by id
router.get("/books/:id", bookController.getBookById);

/* Update a book by id. The request will be a json object with the available fields. */
router.put("/books/:id/update", bookController.update);

/* Delete a book by id */
router.post("/books/:id/delete", bookController.delete);

//get all authors
router.get("/authors", authorController.index);

//get an author by id
router.get("/authors/:id", authorController.getAuthorById);

//create an author
router.post("/authors/create", authorController.create);

//update an author
router.put("/authors/:id/update", authorController.update);

//delete an author
router.post("/authors/:id/delete", authorController.delete);

//get all genres
router.get("/genres", genreController.index);

//get a genre by id
router.get("/genres/:id", genreController.getGenreById);

//create a genre
router.post("/genres/create", genreController.create);

//update a genre
router.put("/genres/:id/update", genreController.update);

//delete a genre
router.post("/genres/:id/delete", genreController.delete);

module.exports = router;
