var mongoose = require("mongoose");
var CampGround = require("./models/campground.js")
var Comment = require("./models/comment.js");
var data = [
    {
        name: "Matauri Bay Holiday Park",
        url: "https://img.theculturetrip.com/800x/smart/wp-content/uploads/2017/11/306750855_f68a351390_b.jpg",
        desc: "This beachfront campground is located towards the northern tip of the North Island, some 30 kilometres (18.6 miles) northeast of the Bay of Islands town of Kerikeri. Besides being set in a wonderfully picturesque coastal location, Matauri Bay is quite ideal for day trips to Cape Reinga. It’s also a great spot for walking, fishing, and trying out water activities "
    },
    {
        name: "Urupukapuka Bay Campsite",
        url: "https://img.theculturetrip.com/800x/smart/wp-content/uploads/2017/11/24563888492_6f2a4ce7c4_k.jpg",
        desc: "Urupukapuka Bay is an island that can be accessed by water taxis and passenger ferries departing from Russell and Paihia. Its campsite is owned by the Department of Conservation and enjoys plenty of beautiful seaside vistas. Walking, kayaking, fishing, and swimming are just some of the popular activities to try. Bookings for this campsite are essential.    "
    },
    {
        name: "Poukaraka Flats",
        url: "https://img.theculturetrip.com/800x/smart/wp-content/uploads/2017/11/9576608590_66d72dca77_k.jpg",
        desc: "Here is another island-based campsite – this time in Waiheke. The Poukaraka Flats Campground is discreetly tucked away at Whakanewha Regional Park on the southern end of the island, and is a great starting point for exploring the surrounding beaches, wetlands, forests, and historic reserves. Facilities at this campsite are quite basic but includes flush toilets and cold showers.        "
    },
    {
        name: "Matai Bay Campsite",
        url: "https://img.theculturetrip.com/800x/smart/wp-content/uploads/2017/11/7626935180_2a4ad2b3c8_k.jpg",
        desc: "Matai Bay on the North Island’s Karikari Peninsula is quite a popular spot among campers, fishing and sea life enthusiasts. Snorkelling is a must-do if you want to see your fair share of marine wildlife up close. The campsite itself operates on a first-come, first-served basis and is accessible to several walking tracks and culturally significant locations.        "
    },
    {
        name: "Opoutere Coastal Camping",
        url: "https://img.theculturetrip.com/800x/smart/wp-content/uploads/2017/11/1024px-opoutere.jpg",
        desc: "The unspoilt campsite at Opoutere offers everything the Coromandel Peninsula is revered for: white sand beaches, lush forests dotted with native Pohutukawa trees, and plenty of tranquility for those who need it most. Advanced bookings during peak tourist months are highly recommended as the entire region experiences a high influx of visitors.        "
    },
];
function seedDB() {
    CampGround.remove({}, function (err) {
        if (err) console.log(err);
        else {
            console.log("removed");
            data.forEach(function (site) {
                CampGround.create(site, function (err, campground) {
                    if (err) console.log(err);
                    else {
                        console.log("added");
                        Comment.create({
                            text: "This is a great place. Wish there was internet.",
                            author: "Rick"
                        }, function (err, comment) {
                            if (err) console.log(err);
                            else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("added comment");
                            }
                        })
                    }
                })
            });
        }
    });
}
module.exports = seedDB;