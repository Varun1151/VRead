const express = require("express")
const router = new express.Router()
const passport = require("passport")
const upload = require("../others/multer")
const { isLoggedIn } = require("../middleware/middleware")

router.get("/", (req, res) => {
    res.redirect("/home")
})

router.get("/home", (req, res) => {
    res.render("home")
});

router.get("/newbookentry", isLoggedIn, upload.single("image"), (req, res) => {
    res.render("newbookentry")
})

router.post("/newbookentry", isLoggedIn, async(req, res) => {
    req.body.image = {
        data: req.file.buffer,
        contentType: "image/png"
    }

    const newbook = new Book({

    });

    await newbook.save()
})

module.exports = router;