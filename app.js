const express = require("express"),
    app = express(),
    flash = require("connect-flash"),
    bodyparser = require("body-parser"),
    passport = require("passport"),
    LocalStratergy = require("passport-local"),
    //passportLocalMongoose = require("passport-local-mongoose"),
    methodoverride = require("method-override"),
    userRouter = require("./routers/user"),
    booksRouter = require("./routers/books"),
    User = require("./models/user")

port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(flash())
app.use(methodoverride("_method"));

app.use(require("express-session")({
    secret: "bfiu3rfohfbfui4b",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    res.locals.info = req.flash("info")
    next();
});

app.use("/", userRouter)
app.use("/", booksRouter)



app.listen(port, () => {
    console.log("VREAD started")
})