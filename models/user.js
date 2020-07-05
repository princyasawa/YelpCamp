var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var passportLocalMongoose = require("passport-local-mongoose");

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


// USER - email, name
var userSchema = mongoose.Schema({
  username: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);