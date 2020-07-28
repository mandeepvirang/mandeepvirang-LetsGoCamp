const express = require('express');
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground"); 
var Comment = require("../models/comment") ;
const { route } = require('./campgrounds');
var middleware = require("../middleware");
router.get("/new", middleware.isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id,(err,campground)=>{
        if(err || !campground){
            req.flash("error","something went wrong")
            res.redirect("/campgrounds");
        }
        else res.render("comments/new",{campground:campground});
    });
});

// post new comment
router.post("/",middleware.isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id,(err,campground)=>{
        if(err || !campground){
            req.flash("error","something went wrong")
            res.redirect("/campgrounds");
        }
        else{
            Comment.create(req.body.comment, (err,comment)=>{
                if(err){
                    res.flash("error", "Something went wrong!");
                }
                else{
                    comment.author.id = req.user.id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Succesfully added comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
});
// edit comment
router.get("/:comment_id/edit",middleware.checkCommentOwnership,(req,res)=>{
    Campground.findById(req.params.id,(err,foundCampground)=>{
        if(err || !foundCampground)res.redirect("back");
        else{
            Comment.findById(req.params.comment_id,(err,foundComment)=>{
                res.render("comments/edit", {campground : foundCampground, comment : foundComment});
            })
            
        }
    })
    
})
// update comments
router.put("/:comment_id",middleware.checkCommentOwnership,(req,res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,updatedCommment)=>{
        if(err || !updatedCommment)res.redirect("back");
        else res.redirect("/campgrounds/"+req.params.id)
    });
});

// delete comment
router.delete("/:comment_id",middleware.checkCommentOwnership,(req,res)=>{
    Comment.findByIdAndDelete(req.params.comment_id,(err)=>{
        if(err)res.redirect("back");
        else{
            req.flash("success","succesfully deleted comment!")
            res.redirect("/campgrounds/"+req.params.id);
        }
        
    })
})


module.exports = router;
