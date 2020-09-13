var mongoose = require("mongoose");
var Comment = require("./comment");
var campSchema = new mongoose.Schema({
    name: String,
    url: String,
    desc: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("CampGround", campSchema);
