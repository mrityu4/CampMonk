var app = require("express");
var router = app.Router();
var Comment = require("../models/comment.js");
var CampGround = require("../models/campground.js");
const { route } = require("./campground.js");
router.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

//new comment page route
router.get("/campgrounds/:id/comments/new", isLoggedIn, function (req, res) {
    CampGround.findById(req.params.id, function (err, foundcamp) {
        if (err) console.log(err);
        else {
            res.render("newcomment.ejs", { camp: foundcamp });
        }
    });
});
//comment edit route
router.get("/campgrounds/:id/comments/:comment_id/edit", isWriter, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundcomment) {
        if (err) res.redirect("back");
        else {
            res.render("commentedit.ejs", { camp_id: req.params.id, comment: foundcomment });
        }
    })
});
//comment update route
router.put("/campgrounds/:id/comments/:comment_id", isWriter, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedcomment) {
        if (err) console.log(err);
        else
            res.redirect("/campgrounds/" + req.params.id);
    })
});



//COMMENT DELETE ROUTE
router.delete("/campgrounds/:id/comments/:comment_id",isWriter, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) console.log(err);
        else res.redirect("/campgrounds/" + req.params.id);
    });
});


router.post("/campgrounds/:id/comments", isLoggedIn, function (req, res) {
    CampGround.findById(req.params.id, function (err, foundcamp) {
        Comment.create(req.body.comment, function (err, createdcomment) {
            if (err) console.log(err);
            else {
                createdcomment.author.id = req.user._id;
                createdcomment.author.username = req.user.username;
                createdcomment.save();
                foundcamp.comments.push(createdcomment);
                foundcamp.save();
                res.redirect("/campgrounds/" + foundcamp._id);
            }
        })
    })
})
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect("/login");
    }
}

function isWriter(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundcomment) {
            console.log(foundcomment.author.id, req.user._id);
            if (foundcomment.author.id.equals(req.user._id)) {
                next();
            }
            else res.redirect("back");
        });
    }
    else {
        res.redirect("back");
    }
}

module.exports = router;