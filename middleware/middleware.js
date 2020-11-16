const User = require("../models/user")
const Book = require("../models/book")

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    req.flash("info", "You need to be logged in to perform the action");
    res.redirect("/login")
}

function checkbookownership(req, res, next) {
    if (req.isAuthenticated()) {

        Book.findById(req.params.id, (err, book) => {
            if (err) {
                res.redirect("back");
            } else {
                if ((book.UUSN).equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission")
                    res.redirect("back")
                }
            }
        })
    } else {
        res.redirect("back");
    }
}
module.exports = { isLoggedIn, checkbookownership }