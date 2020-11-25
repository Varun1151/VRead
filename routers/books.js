const express = require("express")
const router = new express.Router()
    // const passport = require("passport")
const upload = require("../others/multer")
const { isLoggedIn, checkbookownership } = require("../middleware/middleware")
const User = require("../models/user")
const Book = require("../models/book")
const Feedback = require("../models/feedback")

function titlecase(str) {
    var sentence = str.toLowerCase().split(" ");
    for (var i = 0; i < sentence.length; i++) {
        sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    return sentence.join(" ")
}

router.get("/", (req, res) => {
    res.redirect("/home")
})

router.get("/home", (req, res) => {
    var query = {}
    if (req.query.bookname) {
        query.Book_name = titlecase(req.query.bookname)
    }
    if (req.query.Author) {
        query.Author = titlecase(req.query.Author)
    }
    if (req.query.Dept) {
        query.Dept = req.query.Dept
    }
    if (req.query.Edition) {
        query.Edition = req.query.Edition
    }
    if (req.query.Subject) {
        query.Subject = titlecase(req.query.Subject)
    }
    Book.find(query, (err, books) => {
        if (err) {
            console.log(err);
        } else {
            res.render("home", { books: books, query: query });
        }
    }).sort({
        "_id": -1
    })
});

router.get("/bookinfo/:id", (req, res) => {
    Book.findById(req.params.id, (err, book) => {
        if (err) {
            req.flash("error", err.message)
            res.redirect("back")
        } else {
            User.find({ username: book.UUSN }, (err, user) => {
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
        Book_name: titlecase(req.body.bookname),
        Dept: req.body.Dept,
        Subject: titlecase(req.body.Subject),
        Cover_page_photo: req.body.image,
        Price: req.body.Price,
        Author: titlecase(req.body.Author),
        Edition: req.body.Edition,
        UUSN: req.user.username
    });

    try {
        await newbook.save()
        User.findByIdAndUpdate(req.user._id, { $inc: { No_of_uploads: 1 } }, (err, data) => {
            if (err) {
                console.log(err)
            }
        })
        req.flash("success", "Book uploaded")
        res.redirect("/home")
    } catch (e) {
        req.flash("error", "Couldn't upload your data to database")
        res.redirect("back")
    }
}, (error, req, res, next) => {
    req.flash("error", error.message)
})

router.get("/requestbook/:id", isLoggedIn, (req, res) => {
    Book.findByIdAndUpdate(req.params.id, { RUSN: req.user.username, Request_status: true }, (err, updatedBook) => {
        if (err) {
            console.log(err)
            res.redirect("back")
        } else {
            User.findByIdAndUpdate(req.user._id, { $inc: { No_of_request: 1 } }, (err, data) => {
                if (err) {
                    console.log(err)
                }
            })
            res.redirect("/home")
        }
    })
})

router.get("/positiveacknowledgement/:id", (req, res) => {
    const bookid = req.params.id
    Book.findById(bookid, (err, book) => {
        if (!err) {
            User.findOneAndUpdate({ username: book.UUSN }, { $inc: { No_of_uploads: -1 } }, (err, user) => {
                if (err) {
                    console.log(err.message)
                }
            })
            User.findOneAndUpdate({ username: book.RUSN }, { $inc: { No_of_request: -1 } }, (err, user) => {
                if (err) {
                    console.log(err.message)
                }
            })
        }
    })
    Feedback.deleteMany({ Book_id: bookid });
    Book.findByIdAndRemove(bookid, (err) => {
        if (err) {
            res.redirect("/youruploads")
        } else {
            req.flash("success", "Acknowledgement successfull. Details of receiver will be sent ot your mail. Do check the spam if not in inbox")
            res.redirect("/youruploads")
        };
    })
})

router.get("/negativeacknowledgement/:id", (req, res) => {
    Book.findById(req.params.id, (err, book) => {
        if (!err) {
            User.findOneAndUpdate({ username: book.RUSN }, { $inc: { No_of_request: -1 } }, (err, user) => {
                if (err) {
                    console.log(err.message)
                }
            })
        }
    })
    Book.findByIdAndUpdate(req.params.id, { RUSN: null, Request_status: false }, (err, book) => {
        if (err) {
            console.log(err.message)
            res.redirect("/youruploads")
        } else {
            res.redirect("/youruploads")
        }
    });
})


router.post("/feedback", isLoggedIn, async(req, res) => {
    const feedback = new Feedback({
        USN: req.user.username,
        Book_id: req.body.bookid,
        Feedback_msg: req.body.feedbacktext
    })
    try {
        await feedback.save()
        req.flash("success", "Thank you for the feedback. The admins will look into your feedback")
        res.redirect("back")
    } catch (e) {
        req.flash("error", "Couldn't save the feedback. Try again")
        res.redirect("back")
    }
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
    User.findByIdAndUpdate(req.user._id, { $inc: { No_of_uploads: -1 } }, (err, data) => {
        if (err) {
            console.log(err)
        }
    });
    Feedback.deleteMany({ Book_id: req.params.id });
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