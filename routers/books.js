const express = require("express")
const router = new express.Router()
const passport = require("passport")
const upload = require("../others/multer")
const { isLoggedIn } = require("../middleware/middleware")
const User = require("../models/user")
const Book = require("../models/book")

router.get("/", (req, res) => {
    res.redirect("/home")
})

router.get("/home", (req, res) => {
    res.render("home")
});

router.get("/newbookentry", isLoggedIn, (req, res) => {
    res.render("newbookentry")
})

router.post("/newbookentry", isLoggedIn, upload.single("image"), async(req, res) => {
    req.body.image = {
        data: req.file.buffer,
        contentType: "image/png"
    }

    const newbook = new Book({
        Book_name: req.body.bookname,
        Dept: req.body.Dept,
        Subject: req.body.Subject,
        Cover_page_photo: req.body.image,
        Price: req.body.Price,
        Author: req.body.Author,
        Edition: req.body.Edition,
        UUSN: { id: req.user._id }
    });

    try {
        await newbook.save()
        req.flash("success", "Boom uploaded")
        res.redirect("/home")
    } catch (e) {
        req.flash("error", "Couldn't upload your data to database")
        res.redirect("back")
    }
}, (error, req, res, next) => {
    req.flash("error", error.message)
})

module.exports = router;