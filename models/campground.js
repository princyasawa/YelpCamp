var mongoose = require("mongoose");
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



// POST - title, content
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  comments: [
    {
       text: String,
       author: String
    }
 ]
});

module.exports = mongoose.model("Campground", campgroundSchema);