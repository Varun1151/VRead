const express = require("express")
const router = new express.Router()
const passport = require("passport")
const User = require("../models/user")
const upload = require("../others/multer")
const { isLoggedIn } = require("../middleware/middleware")
const Book = require("../models/book")
    // const transporter = require("../others/nodemailer")
    // const Feedback = require("../models/feedback")

function titlecase(str) {
    var sentence = str.toLowerCase().split(" ");
    for (var i = 0; i < sentence.length; i++) {
        sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    return sentence.join(" ")
}

router.get("/login", (req, res) => {
    res.render("login")
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
    failureFlash: true
}), (req, res) => {
    //res.send("iochrichrilo")
});

router.get("/signup", (req, res) => {
    res.render("signup")
});

//handling user sign up
router.post("/signup", upload.single('image'), (req, res) => {

    req.body.image = {
        data: req.file.buffer,
        contentType: "image/png"
    }

    const newuser = new User({
        username: req.body.username,
        Name: titlecase(req.body.name),
        User_Photo: req.body.image,
        Address: req.body.addr,
        Ph_No: req.body.phno,
        Email: req.body.email
    });


    User.register(newuser, req.body.password, (err, user) => {
        if (err) {
            req.flash('error', err.message);
            res.redirect("back")
        }
        passport.authenticate("local")(req, res, function() {
            // var mailOptions = {
            //     // from: 'youremail@gmail.com',
            //     from: 'youremail@gmail.com',
            //     to: seller,buyer
            //     subject: 'VRead Contact share',
            //     text: 'Thank you for using our service'
            // };

            // transporter.sendMail(mailOptions, function(error, info) {
            //     if (error) {
            //         console.log(error);
            //     } else {
            //         console.log('Email sent: ' + info.response);
            //     }
            // });

            req.flash('success', "Welcome " + user.Name);
            res.redirect("/home")
        });
    });
});

router.get("/profile", isLoggedIn, (req, res) => {
    res.render("profile", { user: req.user });
})



router.put("/editprofileinfo", isLoggedIn, (req, res) => {

    const editeduser = new User({
        Name: titlecase(req.body.name),
        Address: req.body.addr,
        Ph_No: req.body.phno,
        Email: req.body.email
    });

    User.findByIdAndUpdate(req.user._id, editeduser, (err, updatedUser) => {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/profile");
        } else {
            req.flash("success", "Profile info changed successfully")
            res.redirect("/profile");
        }
    })
});



router.put("/editprofilepic", upload.single("image"), isLoggedIn, (req, res) => {

    req.body.image = {
        data: req.file.buffer,
        contentType: "image/png"
    }

    User.findByIdAndUpdate(req.user._id, { User_Photo: req.body.image }, (err, updatedUser) => {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/profile");
        } else {
            req.flash("success", "Profile picture changed successfully")
            res.redirect("/profile");
        }
    })
});


// router.get("/deleteuser", isLoggedIn, (req, res) => {
//     var usn = req.user.username
//     console.log(usn)
//     Book.find({ UUSN: usn }, (err, books) => {
//         books.forEach(book => {
//             if (book.Request_status) {
//                 req.flash("error", "There are some requests to your uploaded books. Please acknowledge or reject them before you delete your account");
//                 res.redirect("/youruploads")
//             }
//             Feedback.deleteMany({ Book_id: book._id })
//         })
//     })
//     Book.find({ RUSN: usn }, (err, books) => {
//         books.forEach(book => {
//             Book.findOneAndUpdate({ RUSN: usn }, { RUSN: null, Request_status: false }, (err, book) => {})
//         })
//     })
//     Feedback.deleteMany({ USN: usn });
//     Book.deleteMany({ UUSN: usn })
//     res.redirect("/deleteuser?_method=DELETE")
// })

// router.delete("/deleteuser", isLoggedIn, (req, res) => {
//     User.findOneAndRemove({ username: req.user.username }, (err) => {
//         if (err) {
//             req.flash("error", err.message);
//             res.redirect("/home")
//         } else {
//             console.log("in remove section")
//             req.flash("success", "Account deleted successfully. We are sad to see you go")
//             res.redirect("/home")
//         };
//     })
// })


router.get("/youruploads", isLoggedIn, (req, res) => {
    Book.find({ UUSN: req.user.username }, (err, books) => {
        if (err) {
            res.redirect("back")
        } else {
            res.render("youruploads", { books: books })
        }
    }).sort({
        "_id": -1
    })
})

router.get("/yourrequests", isLoggedIn, (req, res) => {

    Book.find({ RUSN: req.user.username }, (err, books) => {
        if (err) {
            res.redirect("back")
        } else {
            res.render("yourrequests", { books: books })
        }
    }).sort({
        "_id": -1
    })
})

router.get("/logout", isLoggedIn, (req, res) => {
    req.logout();
    req.flash("success", "Logged out successfully")
    res.redirect("/home");
});


module.exports = router;