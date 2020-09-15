var express = require("express");
var app = express();
var passport = require("passport");
var LocalStrategy = require("passport-local");
var bodyparser = require("body-parser");
var seed = require("./seed");
var CampGround = require("./models/campground.js");
var User = require("./models/user.js");
var Comment = require("./models/comment.js");
const { request } = require("express");
var methodOverride = require("method-override");
var mongoose = require("mongoose");
// const comment = require("./models/comment");
app.use(bodyparser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(methodOverride("_method"));
var camproutes = require('./routes/campground.js');
var commentroutes = require('./routes/comment.js');
var authroutes = require('./routes/index.js');
// seed();
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
})

//PASSPORT SETUP
app.use(require("express-session")({
    secret: "This is the Hashkey",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(express.static(__dirname + "/public"))
mongoose.connect("mongodb+srv://mrityu:msm8974ac@cluster0.evoz4.mongodb.net/campmonk?retryWrites=true&w=majority",
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });

app.use(camproutes);
app.use(commentroutes);
app.use(authroutes);

app.listen(process.env.PORT || 3000, function () {
    console.log("CampMonk server has started!!");
});
