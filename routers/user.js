const express = require("express")
const router = new express.Router()
const passport = require("passport")
const User = require("../models/user")
const upload = require("../others/multer")
const { isLoggedIn } = require("../middleware/middleware")
const Book = require("../models/book")

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
            req.flash('success', "Welcome " + user.Name);
            res.redirect("/home")
        });
    });
});

router.get("/profile", isLoggedIn, (req, res) => {
    res.render("profile", { user: req.user });
})

router.get("/editprofileinfo", isLoggedIn, (req, res) => {
    res.render("editprofileinfo", isLoggedIn, { user: req.user })
})

router.put("/editprofileinfo", (req, res) => {
    User.findByIdAndUpdate(req.user._id, req.body.editeduser, (err, updatedUser) => {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/profile");
        } else {
            req.flash("success", "Profile info changed successfully")
            res.redirect("/profile");
        }
    })
});

router.get("/editprofilepic", isLoggedIn, (req, res) => {
    res.render("editprofilepic", { user: req.user })
})

router.put("/editprofilepic", upload.single("image"), (req, res) => {

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

router.get("/youruploads", isLoggedIn, (req, res) => {
    Book.find({ UUSN: req.user.username }, (err, books) => {
        if (err) {
            res.redirect("back")
        } else {
            res.render("youruploads", { books: books })
        }
    })
})

router.get("/yourrequests", isLoggedIn, (req, res) => {

    Book.find({ RUSN: req.user.username }, (err, books) => {
        if (err) {
            res.redirect("back")
        } else {
            res.render("yourrequests", { books: books })
        }
    })
})

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged out successfully")
    res.redirect("/home");
});


module.exports = router;