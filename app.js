//jshint esversion:6
require ('dotenv').config(); // require as early as possible hence position in code
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require ("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();



app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userSchema = new mongoose.Schema ({

    email: String,
    password: String
});



userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"] }); //must happen before model created // encrypts database, desired fields must be stated eg password 

const User = new mongoose.model("User",userSchema);     //Secret key is in invisible env file thus process.env_ to protect from hackers 


app.get("/", function(req, res){
    
    res.render("home");
});

app.get("/login", function(req, res){
    
    res.render("login");
});

app.get("/register", function(req, res){
    
    res.render("register");
});

app.get("/submit", function(req, res){
    
    res.render("submit");
});

// where we want to capture the data from = register page

app.post("/register", function(req, res){

    const newUser = new User({

        email: req.body.username,
        password: req.body.password
    });
    
    newUser.save().then(function(err){   //.then bcz mongoose.save no longer accepts callbacks
        if (err){
            console.log(err);
        }else {
            res.render("secrets.ejs")   //if user not registered they may not enter secrets page thus only rendered here.
                
        }
    });
});

app.post("/login", function (req,res){

    const username = req.body.username;
    const password = req.body.password;

    User.findOne().then({email : username},function(err,foundUser){

        if(err){
            console.log(err);
        } else {
            if (foundUser){
                if(foundUser.password === password) {
                    res.render("secrets.ejs");
                }
            }
        }
    })
});




app.listen(3000, function(){
  console.log('server running on port 3000');
});
