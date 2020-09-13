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
var mongoose = require("mongoose");
const comment = require("./models/comment");
app.use(bodyparser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//
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

app.get("/", function (req, res) {
    res.render("landing.ejs");
});
app.use(express.static(__dirname + "/public"))
mongoose.connect("mongodb+srv://mrityu:msm8974ac@cluster0.evoz4.mongodb.net/<dbname>?retryWrites=true&w=majority",
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });

// CampGround.create(
//     {
//         name: "Mountain Inn",
//         url:
//             "https://i.pinimg.com/originals/71/47/2d/71472df0985d8b21b0a6bdf03e296db3.png",
//         desc:""
//     }, function (err, camp) {
//         if (err) {
//             console.log(err);
//         }
//         else
//             console.log(camp);
//     });


app.get("/campgrounds", function (req, res) {

    CampGround.find({}, function (err, dbCampGround) {
        if (err) console.log(err);
        else
            res.render("index.ejs", { camps: dbCampGround, currentUser: req.user });

    });
});

app.post("/campgrounds", function (req, res) {
    var enteredname = req.body.name;
    var enteredurl = req.body.url;
    var entereddesc = req.body.desc;
    var camp = { name: enteredname, url: enteredurl, desc: entereddesc };
    CampGround.create(camp, function (err, newcamp) {
        if (err) console.log(err);
        else res.redirect("/campgrounds");

    });
    //   redirect defaults to get request
});


app.get("/campgrounds/:id", function (req, res) {

    CampGround.findById(req.params.id).populate("comments").
        exec(function (err, foundcamp) {
            if (err) console.log(err);
            else {
                // console.log(foundcamp, "here");
                res.render("show.ejs", { camp: foundcamp });
            }
        });
});

app.get("/campgrounds/new", function (req, res) {
    res.render("new.ejs");
});
//new comment page route
app.get("/campgrounds/:id/comments/new", isLoggedIn, function (req, res) {
    CampGround.findById(req.params.id, function (err, foundcamp) {
        if (err) console.log(err);
        else {
            res.render("newcomment.ejs", { camp: foundcamp });
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function (req, res) {
    CampGround.findById(req.params.id, function (err, foundcamp) {
        Comment.create(req.body.comment, function (err, createdcomment) {
            if (err) console.log(err);
            else {
                foundcamp.comments.push(createdcomment);
                foundcamp.save();
                res.redirect("/campgrounds/" + foundcamp._id);
            }
        })
    })
})

//================
//REGISTER ROUTES
//================
app.get("/register", function (req, res) {
    res.render("register.ejs");
});

app.post("/register", function (req, res) {
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
app.get("/login", function (req, res) {
    res.render("login.ejs");
});

app.post("/login", passport.authenticate("local",

    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),
    function (req, res) {
    });
//Logout route
app.get("/logout", function (req, res) {
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

app.listen(process.env.PORT || 3000, function () {
    console.log("CampMonk server has started!!");
});
