var app = require("express");
var router = app.Router();
var Comment = require("../models/comment.js");
var CampGround = require("../models/campground.js");
router.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
})


router.get("/campgrounds/new", isLoggedIn, function (req, res) {
    res.render("new.ejs");
});
router.get("/campgrounds", function (req, res) {

    CampGround.find({}, function (err, dbCampGround) {
        if (err) console.log(err);
        else
            res.render("index.ejs", { camps: dbCampGround, currentUser: req.user });

    });
});

router.post("/campgrounds", isLoggedIn, function (req, res) {
    var enteredname = req.body.name;
    var enteredurl = req.body.url;
    var entereddesc = req.body.desc;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var camp = { name: enteredname, url: enteredurl, desc: entereddesc, author: author };
    CampGround.create(camp, function (err, newcamp) {
        if (err) console.log(err);
        else res.redirect("/campgrounds");

    });
    //   redirect defaults to get request
});

router.delete("/campgrounds/:id", isOwner, function (req, res) {
    CampGround.findByIdAndDelete(req.params.id, function (err) {
        if (err) console.log(err);
        else res.redirect("/campgrounds");
    })
});


router.get("/campgrounds/:id", function (req, res) {

    CampGround.findById(req.params.id).populate("comments").
        exec(function (err, foundcamp) {
            if (err) console.log(err);
            else {
                // console.log(foundcamp, "here");
                res.render("show.ejs", { camp: foundcamp });
            }
        });
});

router.get("/campgrounds/:id/edit", isOwner, function (req, res) {
    CampGround.findById(req.params.id, function (err, foundcamp) {
        if (err) console.log(err);
        else {
            res.render("campgroundedit.ejs", { camp: foundcamp });
        }
    });
});
router.put("/campgrounds/:id", isOwner, function (req, res) {
    CampGround.findByIdAndUpdate(req.params.id, req.body.camp, function (err, updatedcamp) {
        if (err) console.log(err);
        else {
            res.redirect("/campgrounds/" + updatedcamp._id);
        }
    })
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect("/login");
    }
}
function isOwner(req, res, next) {
    if (req.isAuthenticated()) {
        CampGround.findById(req.params.id, function (err, foundcamp) {
            if (foundcamp.author.id.equals(req.user._id)) {
                next();
            }
            else res.redirect("back");
        })
    }
    else {
        res.redirect("back");
    }
}

module.exports = router;