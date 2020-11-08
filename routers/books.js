const express = require("express")
const router = new express.Router()
const passport = require("passport")

router.get("/", (req, res) => {
    res.redirect("/home")
})

router.get("/home", (req, res) => {
    res.render("home")
});

module.exports = router;