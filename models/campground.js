var mongoose = require("mongoose");
var Comment = require("./comment")
 
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   author : {
       id :{
        type : mongoose.Schema.Types.ObjectId,
        ref: "User"
       },
       username : String
   },
   comments: [
       {
           type : mongoose.Schema.Types.ObjectId,
           ref : "Comment"
       }
   ]
});
campgroundSchema.pre('deleteOne',({document:true, query: false}),async function(next){
    try{
        await Comment.deleteMany({
            "_id":{
                $in:this.comments
            }
        });
        next();
    }
    catch(err){
        next(err);
    }
})
 
 
module.exports = mongoose.model("Campground", campgroundSchema);