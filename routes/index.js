var app = require("express");
var router = app.Router();
var User = require("../models/user");
var passport = require("passport");


router.get("/", function (req, res) {
    res.render("landing.ejs");
});

//================
//REGISTER ROUTES
//================
router.get("/register", function (req, res) {
    res.render("register.ejs");
});

router.post("/register", function (req, res) {
    var newuser = new User({
        username: req.body.username
    });
    console.log(req.body.username);
    User.register(newuser, req.body.password, function (err, user) {
        if (err) {
            res.render("register.ejs");
        }
        else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/campgrounds");
            });
        }
    });

});



//================
//LOGIN ROUTES
//================
router.get("/login", function (req, res) {
    res.render("login.ejs");
});

router.post("/login", passport.authenticate("local",

    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),
    function (req, res) {
    });
//Logout route
router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect("/login");
    }
}

module.exports = router;