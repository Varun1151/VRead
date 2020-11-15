const User = require("../models/user")

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    req.flash("info", "You need to be logged in to perform the action");
    res.redirect("/login")
}

module.exports = { isLoggedIn }