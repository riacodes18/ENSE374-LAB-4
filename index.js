class user
{
constructor(user_name, pass_word)

{
this.username = user_name;
this.password = pass_word;
}

}




class task 
{

constructor (id, some_name, some_owner, some_creator, done, cleared)

{
this.id = id;
this.name = some_name;
this.owner = some_owner;
this.creator = some_creator;
this.done = true;
this.cleared = false;
}

}


var user_1 = new user ("joy123", "321yoj");
var user_2 = new user("bill567", "765llib");



var task_1 = new task(1, "task_1", "", "", false, true);
var task_2 = new task(2, "task_2", user_1, user_1, false, false);
var task_3 = new task(3, "task_3", user_2, user_2, false, false);
var task_4 = new task(4, "task_4", user_1, user_1, true, false);
var task_5 = new task(5, "task_5", user_2, user_2, true, false);



var list_users = {user_1, user_2};
var list_tasks = {task_1, task_2, task_3, task_4, task_5};


const fs = require('fs');



var myuserstring = fs.readFileSync('users.json');
var mytaskstring = fs.readFileSync('task.json');



var USER = JSON.parse(myuserstring);
var TASK = JSON.parse(mytaskstring);



console.log(USER);
console.log(TASK);




console.log('Server');
// add all your boilerplate code up here
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

// new requires for passport
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")

// allows using dotenv for environment variables
require("dotenv").config();


const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// set up session
app.use(session({
    secret: process.env.SECRET, // stores our secret in our .env file
    resave: false,              // other config settings explained in the docs
    saveUninitialized: false
}));

// set up passport
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

// passport needs to use MongoDB to store users
mongoose.connect("mongodb://localhost:27017/usersDB", 
                {useNewUrlParser: true, // these avoid MongoDB deprecation warnings
                 useUnifiedTopology: true});

// This is the database where our users will be stored
// Passport-local-mongoose handles these fields, (username, password), 
// but you can add additional fields as needed
const userSchema = new mongoose.Schema ({
    username: String,
    password: String
})

// configure passportLocalMongoose
userSchema.plugin(passportLocalMongoose);

// Collection of users
const User = new mongoose.model("User", userSchema)

// more passport-local-mongoose config
// create a strategy for storing users with Passport
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const port = 3000; 

app.listen (port, function() {
    // code in here runs when the server starts
    console.log("Server is running on port " + port);
})




app.get('/users', function userfunc(req, res){

    res.send(users);
}
); 

 

app.get('/task', function taskfunc(req, res){
    
    res.send(tasks);
} 
); 

app.get("/" , function (reg, res){
    res.sendFile(__dirname + "/index.html");
});

app.get("/style.css" , function(reg, res){
    res.sendFile(__dirname + "/style.css");
});

// register route
app.post("/register", function(req, res) {
    console.log("Registering a new user");
    // calls a passport-local-mongoose function for registering new users
    // expect an error if the user already exists!
    User.register({username: req.body.username}, req.body.password, function(err, user){
        if (err) {
            console.log(err);
            res.redirect("/")
        } else {
            // authenticate using passport-local
            // what is this double function syntax?! It's called currying.
            passport.authenticate("local")(req, res, function(){
                res.redirect("/todo")
            });
        }
    });
});

// login route
app.post("/login", function(req, res) {
    console.log("A user is logging in")
    // create a user
    const user = new User ({
        username: req.body.username,
        password: req.body.password
     });
     // try to log them in
    req.login (user, function(err) {
        if (err) {
            // failure
            console.log(err);
            res.redirect("/")
        } else {
            // success
            // authenticate using passport-local
            passport.authenticate("local")(req, res, function() {
                res.redirect("/todo"); 
            });
        }
    });
});


// todo
app.get("/todo", function(req, res){
    console.log("A user is accessing todo")
    if (req.isAuthenticated()) {
        // pass the username to EJS
        res.render("todo", {user: req.user.username});
    } else {
        res.redirect("/");
    }
});

// logout
app.get("/logout", function(req, res){
    console.log("A user logged out")
    req.logout();
    res.redirect("/");
})


app.listen = 3000;