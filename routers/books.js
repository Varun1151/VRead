const express = require("express")
const router = new express.Router()
const upload = require("../others/multer")
const { isLoggedIn, checkbookownership } = require("../middleware/middleware")
const User = require("../models/user")
const Book = require("../models/book")
const Feedback = require("../models/feedback")
const transporter = require("../others/nodemailer")

function titlecase(str) {
    if (str.length > 0) {
        var sentence = str.toLowerCase().split(" ");
        for (var i = 0; i < sentence.length; i++) {
            sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
        }
        return sentence.join(" ")
    } else {
        return str
    }
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
    query.Request_status = false
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
            User.findOne({ username: book.UUSN }, (err, user) => {
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
        await User.findByIdAndUpdate(req.user._id, { $inc: { No_of_uploads: 1 } }, (err, data) => {
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
            User.findOne({ username: updatedBook.UUSN }, { Email: 1 }, (err, uploadeduser) => {
                var mailOptions = {
                    from: '1ms18cs133@gmail.com',
                    to: uploadeduser.Email,
                    subject: 'Book request ' + updatedBook.Book_name,
                    text: 'User with usn ' + req.user.username +
                        " has requested for your book titled " + updatedBook.Book_name +
                        ". Please do acknowledge or reject in upload section"
                };

                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            })

            res.redirect("/home")
        }
    })
})

router.get("/positiveacknowledgement/:id", checkbookownership, (req, res) => {
    const bookid = req.params.id
    var seller, buyer;
    Book.findById(bookid, (err, book) => {
        if (!err) {

            User.findOneAndUpdate({ username: book.UUSN }, { $inc: { No_of_uploads: -1 } }, (err, user) => {
                if (err) {
                    console.log(err.message)
                }
                seller = user.Email
            })

            User.findOneAndUpdate({ username: book.RUSN }, { $inc: { No_of_request: -1 } }, (err, receiver) => {
                if (err) {
                    console.log(err.message)
                }
                buyer = receiver.Email
                var mailOptions = {
                    // from: 'youremail@gmail.com',
                    from: '1ms18cs133@gmail.com',
                    to: seller + "," + buyer,
                    subject: 'VRead Contact share',
                    html: "<h3>Seller's Details</h3>" +
                        "<h6>USN : " + req.user.username + "</h6>" +
                        "<h6>Name : " + req.user.Name + "</h6>" +
                        "<h6>Contact no : " + req.user.Ph_No + "</h6>" +
                        "<h6>Email :" + req.user.Email + "</h6><br><hr>" +

                        "<h3>Book Details</h3>" +
                        "<h6>Book Name : " + book.Book_name + "</h6>" +
                        "<h6>Author : " + book.Author + "</h6>" +
                        "<h6>Price :" + book.Price + "</h6><br><hr>" +

                        "<h3>Buyer's Details</h3>" +
                        "<h6>USN : " + receiver.username + "</h6>" +
                        "<h6>Name : " + receiver.Name + "</h6>" +
                        "<h6>Contact no : " + receiver.Ph_No + "</h6>" +
                        "<h6>Email :" + receiver.Email + "</h6>"
                };

                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
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

router.get("/negativeacknowledgement/:id", checkbookownership, (req, res) => {
    Book.findById(req.params.id, (err, book) => {
        if (!err) {
            User.findOneAndUpdate({ username: book.RUSN }, { $inc: { No_of_request: -1 } }, (err, user) => {
                if (err) {
                    console.log(err.message)
                }
                var mailOptions = {
                    from: '1ms18cs133@gmail.com',
                    to: user.Email,
                    subject: 'Request rejected',
                    text: "Your request for book titled " + book.Book_name + " uploaded by : " + book.UUSN + " has been rejected"
                };

                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
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
});


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

// router.get("/editbookinfo/:id", checkbookownership, (req, res) => {
//     Book.findById(req.params.id, (err, book) => {
//         if (err) {
//             console.log(err)
//             res.redirect("back")
//         } else {
//             res.render("editbookinfo", { book: book })
//         }
//     })
// })

router.put("/editbookinfo/:id", checkbookownership, (req, res) => {
    var id = req.params.id
    const editedbook = {
        Dept: req.body.Dept,
        Subject: titlecase(req.body.Subject),
        Price: req.body.Price,
        Author: titlecase(req.body.Author),
        Edition: req.body.Edition,
    }
    Book.findByIdAndUpdate(id, editedbook, (err, updatedBook) => {
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

router.get("*", (req, res) => {
    res.render("error404")
})
module.exports = router;