const express = require('express');
var router = express.Router();
var Campground = require("../models/campground"); 
var middleware = require("../middleware");
router.get("/",(req,res)=>{
    
    Campground.find({},(err,campgrounds)=>{
        if(err)console.log("err");
        else res.render("campgrounds/index", {campgrounds: campgrounds});
    })  
});

// CREATE
router.post("/",middleware.isLoggedIn,(req,res)=>{
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id : req.user._id,
        username : req.user.username
    }
    var newCampground = {name : name, image : image, description : description, author : author};
    Campground.create(newCampground,(err,Campground)=>{
        console.log(Campground)
        if(err)console.log(err);
        else res.redirect("/campgrounds");
    })

    
    
});
// NEW
router.get("/new",middleware.isLoggedIn,(req,res)=>{
    res.render("campgrounds/new");
});

// SHOW
router.get("/:id",(req,res)=>{
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground)=>{
        if(err || !foundCampground){
            req.flash("error","Campground not found");
            res.redirect("back");
        }
        else{ 
            res.render("campgrounds/show", {campground:foundCampground})
            }
    });
});
// edit campground
router.get("/:id/edit",middleware.checkCampgroundOwnership,(req,res)=>{
    Campground.findById(req.params.id, (err,foundCampground)=>{
        if(err || !foundCampground){
                res.redirect("/campgrounds")
        }
        else{ 
             res.render("campgrounds/edit",{campground: foundCampground});
        }
    })
});

router.put("/:id",middleware.checkCampgroundOwnership,(req,res)=>{
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,(err,updatedCampground)=>{
        if(err || !foundCampground){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

// destroy(delete) campground
router.delete("/:id", middleware.checkCampgroundOwnership,async (req,res)=>{
    try{
        let foundCampground = await Campground.findById(req.params.id);
       if(foundCampground){
        await foundCampground.deleteOne();
       }
        res.redirect("/campgrounds")
    }
    catch(err){
        console.log(err.message);
        res.redirect("/campgrounds/"+req.params.id);
    }
})




module.exports = router;