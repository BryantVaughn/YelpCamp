var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// ROOT ROUTE
router.get("/", function(req, res) {
    res.render("landing");
});

// Register Form Route
router.get("/register", function(req, res) {
    res.render("register", {page: "register"});
});

// handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
    });
    if(req.body.adminCode === 'secretcode123') {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function() {
            if(newUser.isAdmin) {
                req.flash("success", "Welcome to YelpCamp " + user.username + "! Admin access.");
                res.redirect("/campgrounds");
            } else {
                req.flash("success", "Welcome to YelpCamp " + user.username);
                res.redirect("/campgrounds");
            }
        });
    });
});

// show login form
router.get("/login", function(req, res) {
    res.render("login", {page: "login"});
});

// handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
});

// logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Successfully logged out!");
    res.redirect("/campgrounds");
});

module.exports = router;