const { Pool, Client } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "free-library",
  password: "mynewpassword",
  port: 5432,
});

//export the functions to be used in the routes

//Get all genres from the database and push them to an array

module.exports.index = function (req, res, next) {
  var genreArray = [];
  pool.query("SELECT * FROM genres", (err, result) => {
    if (err) {
      console.log(err);
    }
    for (var i = 0; i < result.rows.length; i++) {
      genreArray.push(result.rows[i]);
    }
    //send the array to the view
    res.render("genreList", {
      title: "Genres",
      genreArray,
    });
  });
};

//Get a single genre by id
module.exports.getGenreById = function (req, res, next) {
  const id = req.params.id;
  //join the books of the genre to the genre
  pool.query(
    "SELECT genres.id, genres.name, books.title FROM genres LEFT JOIN books ON genres.id = books.genre_id WHERE genres.id = $1",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      var genre = {
        id: result.rows[0].id,
        name: result.rows[0].name,
        books: [],
      };
      for (let i = 0; i < result.rows.length; i++) {
        genre.books.push(result.rows[i].title);
      }
      console.log(genre);
      res.render("genreView", {
        title: genre.name,
        books: genre.books,
      });
    }
  );
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
  //check if the genre has any books by checking if genre_id is in books table and if it is, return error
  const id = req.params.id;
  pool.query("SELECT * FROM books WHERE genre_id = $1", [id], (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result.rows.length > 0) {
      //send error message with redirect and flash message to the view to display to the user that the genre has books.
      res.redirect("/catalog/genres");
      console.log("Genre has books");
    } else {
      pool.query("DELETE FROM genres WHERE id = $1", [id], (err, result) => {
        if (err) {
          console.log(err);
        }
        res.redirect("/catalog/genres");
      });
    }
  });
};
