var express = require("express");
var app = express()
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user")

const db = "mongodb://localhost/yelp_camp";

mongoose.connect(db, {
  useCreateIndex:true,
  useUnifiedTopology:true,
  useNewUrlParser:true,
  useFindAndModify:false
}).then( () => {
    
}).catch((err) => {
  console.log("DataBase Connection Error " + err);
})


function resolvePromise() {
  return rejectPromise();
}

function rejectPromise() {
  return Promise.reject();
}

resolvePromise().then(() => {
  console.log('resolved');
  console.log("flag #3");
}).catch((err) => {
  
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));

app.use(require("express-session")({
    secret: "My name is Princy since always",
    resave: false,
    saveUninitialized: false

}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    
  });
  
var Campground = mongoose.model("Campground", campgroundSchema);

//seedDB();
//   Campground.create({
//      name: "Salmon Creek",
//      image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg",
//      description: "It is indeed a very nice place to go camping. The scenes were amazing"
//   },
//      function(err, campground){
//      if(err){
//          console.log(err);
//      }else {
//          console.log(campground);
//      }
//  })

// var campgrounds = [
//     {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
//     {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
//     {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
//     {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
//     {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
//     {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
//     {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
//     {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
//     {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"}
// ];

app.get("/", function(req, res){
    res.render("landing.ejs");
})

app.get("/campgrounds", function(req, res){
    Campground.find({},  function(err, allcampground){
        if(err)
        {
            console.log(err);
        }else {
            
            res.render("campgrounds.ejs" ,{campgrounds: allcampground, currentUser: req.user});
        }
    });
    // res.render("campgrounds.ejs" ,{campgrounds:campgrounds});
})

app.post("/campgrounds", isLoggedIn , function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc}
    
     Campground.create(newCampground, function(err, newOne){
         if(err){
             console.log(err);
         }else {

             res.redirect("/campgrounds");
         }
     })
    //redirect back to campgrounds page
    
});

app.get("/campgrounds/new", isLoggedIn , function(req, res){

   res.render("new.ejs"); 
});

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id, function(err, found){
        if(err){
            console.log(err);
        } else {
            res.render("show.ejs", {campground:found});
        }
    })
});

app.get("/login", function(req, res){
    res.render("login.ejs")
});

app.post("/login",passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"

}), function(req, res){
     
})

app.get("/register", function(req, res){
    res.render("register.ejs");
})

 app.post("/register", function(req, res){
     var usernew = new User({username: req.body.username});
      User.register(usernew, req.body.password, function(err, user){
          if(err){
              console.log(err);
              return res.render("register");
          } else {
               passport.authenticate("local")(req, res, function(){
                   console.log(user);
                   
                   res.redirect("/campgrounds");
             })
               }});
          }
 )

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds")
})
    
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(3000)