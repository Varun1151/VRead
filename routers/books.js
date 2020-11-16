const express = require("express")
const router = new express.Router()
const passport = require("passport")
const upload = require("../others/multer")
const { isLoggedIn, checkbookownership } = require("../middleware/middleware")
const User = require("../models/user")
const Book = require("../models/book")

router.get("/", (req, res) => {
    res.redirect("/home")
})

router.get("/home", (req, res) => {
    Book.find({}, (err, books) => {
        if (err) {
            console.log(err);
        } else {
            //res.set("Content-Type", "image/png")
            res.render("home", { books: books });
        }
    })
});

router.get("/bookinfo/:id", (req, res) => {
    Book.findById(req.params.id, (err, book) => {
        if (err) {
            req.flash("error", err.message)
            res.redirect("back")
        } else {
            User.findById(book.UUSN, (err, user) => {
                if (err) {
                    req.flash("error", err.message)
                    res.redirect("back")
                } else {
                    res.render("show", { book: book, user: user })
                }
            })
        }
    })
})

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
        UUSN: req.user._id
    });

    try {
        await newbook.save()
        req.flash("success", "Book uploaded")
        res.redirect("/home")
    } catch (e) {
        req.flash("error", "Couldn't upload your data to database")
        res.redirect("back")
    }
}, (error, req, res, next) => {
    req.flash("error", error.message)
})

router.get("/requestbook/:id", checkbookownership, (req, res) => {
    Book.findByIdAndUpdate(req.params.id, { RUSN: req.user._id, Request_status: true }, (err, updatedBook) => {
        if (err) {
            console.log(err)
            res.redirect("back")
        } else {
            res.redirect("/home")
        }
    })
})

router.get("/editbookinfo/:id", checkbookownership, (req, res) => {
    Book.findById(req.params.id, (err, book) => {
        if (err) {
            console.log(err)
            res.redirect("back")
        } else {
            res.render("editbookinfo", { book: book })
        }
    })
})

router.put("/editbookinfo/:id", checkbookownership, (req, res) => {
    var id = req.params.id
    Book.findByIdAndUpdate(id, req.body.editedbook, (err, updatedBook) => {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/bookinfo/" + id);
        } else {
            req.flash("success", "Book info changed successfully")
            res.redirect("/bookinfo/" + id);
        }
    })
});

router.delete("/deletebookinfo/:id", checkbookownership, (req, res) => {
    Book.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/home")
        } else {
            req.flash("success", "Book deleted")
            res.redirect("/home")
        };
    })
});


module.exports = router;