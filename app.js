var express = require("express");
var app = express();

app.get("/", function (req, res) {
  res.send("Welcome to Campmonk!!");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("CampMonk server has started!!");
});
