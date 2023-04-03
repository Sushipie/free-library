module.exports.index = function (req, res, next) {
  //send the index page
  res.render("index", { title: "Free Library" });
};
