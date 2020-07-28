const express = require('express');
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// INDEX
router.get("/",(req,res)=>{
    res.render("landing");
});
// signup form
router.get("/register",(req,res)=>{
    res.render("register");
});
// handel the signup
router.post("/register",(req,res)=>{
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password,(err,user)=>{
        if(err){
            req.flash("error",err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req,res,()=>{
            req.flash("success", "Welcome to YelpCamp "+ user.username )
            res.redirect("/campgrounds");
        })
    })
});

// show login form
router.get("/login",(req,res)=>{
    res.render("login");
});

// handle login (it also has a middleware)
router.post("/login",passport.authenticate("local",{
    // successRedirect:"/campgrounds",
    failureRedirect: "/login",
    failureFlash: 'Invalid username or password.',
    successFlash: `Successfully logged in. `
}),(req,res)=>{
    var redirectTo = req.session.redirectTo || "/campgrounds" ;
    delete req.session.redirectTo;
    res.redirect(redirectTo);
});

// logout route
router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success","Successfully logged out!")
    res.redirect("/login");
});

module.exports = router;