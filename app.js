var express = require("express");
var app = express();

app.get("/", function (req, res) {
  res.render("landing.ejs");
});
var campGrounds = [
  {
    name: "salmon Creek",
    url: "https://www.photosforclass.com/download/px_699558",
  },
  {
    name: "Granite Hill",
    url: "https://www.photosforclass.com/download/px_1061640",
  },
  {
    name: "Mountain Inn",
    url: "https://www.photosforclass.com/download/px_1230302",
  },
];

app.get("/campgrounds", function (req, res) {
  res.render("campgrounds.ejs", { camps: campGrounds });
});
app.listen(process.env.PORT || 3000, function () {
  console.log("CampMonk server has started!!");
});
