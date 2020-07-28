const express = require("express"),
        app = express(),
        bodyParser = require("body-parser"),
        passport = require('passport'),
        methodOverride = require('method-override'),
        LocalStrategy = require('passport-local'),
        mongoose = require('mongoose'),
        flash = require("connect-flash"),
        dotenv = require('dotenv')
dotenv.config();
// requiring routes
var commentRoutes = require("./routes/comments"),    
    campgroundsRoutes = require("./routes/campgrounds"),    
    indexRoutes = require("./routes/index")   

var Campground = require('./models/campground'),
    // seedDB = require('./seeds.js'),
    Comment = require('./models/comment'),
    User = require("./models/user");
const campground = require("./models/campground");

// mongoose.connect('mongodb://localhost:27017/yelp_camp', {
//     useNewUrlParser: true,
//     useUnifiedTopology : true
// })
// .then(()=> console.log("Connected to db!"))
// .catch((error)=>console.log(error.message))
// console.log(process.env.DATABASEURL)
mongoose.connect(process.env.DATABASEURL, {
    useNewUrlParser: true,
    useUnifiedTopology : true,
    useCreateIndex:true
})
.then(()=> console.log("Connected to db!"))
.catch((error)=>console.log(error.message))

// seedDB();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// making req.user vailable to every page{as a middleware}
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// using routes
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundsRoutes);
app.use("/campgrounds/:id/comment",commentRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, ()=>{
    console.log("The yelpcamp server has started!");
});