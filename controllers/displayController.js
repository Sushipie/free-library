module.exports.index = function (req, res, next) {
  //send the index page
  res.render("index", { title: "Free Library" });
};

// module.exports.create = function (req, res, next) {
//   //send the create page
//   res.render("bookform", { title: "Create a book" });
// };
