var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = "mongodb://localhost/yelp_camp1";

mongoose.connect(db, {
  useCreateIndex:true,
  useUnifiedTopology:true,
  useNewUrlParser:true
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




//app.use(bodyParser.urlencoded({extended: true}));
//mongoose.connect("mongodb://localhost/blog_demo_2");

var Post = require("./models/campground");
var User = require("./models/comments");

User.remove({}, function() {
    Post.remove({}, function() {
        User.create({
            email: "bob@gmail.com",
            name: "Bob Belcher"
        }, function(err, user) {
            if(err) {
                console.log(err);
            } else {
                User.findOne({email: "bob@gmail.com"}).populate("posts").exec(function(err, foundUser){
                    if(err) {
                        console.log(err);
                    } else {
                        console.log(foundUser);
                        Post.create({
                          title: "How to cook the best burger pt. 2",
                          content: "blah blah blah blah blah"
                        }, function(err, post){
                            if(err) {
                                console.log(err);
                            } else {
                                User.findOne({email: "bob@gmail.com"}, function(err, foundUser){
                                    if(err){
                                        console.log(err);
                                    } else {
                                        foundUser.posts.push(post._id);
                                        foundUser.save(function(err, data){
                                            if(err){
                                                console.log(err);
                                            } else {
                                                console.log(data);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
 
    });
});
