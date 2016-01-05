var express = require("express");
var bcrypt = require("bcrypt");
var auth = require("../auth");
var userRepo = require("../data/user");

var router = express.Router();
router.route("/login").get(login).post(auth.authenticate);
router.route("/register").get(register).post(registerPost);
router.route("/logout").get(auth.isLoggedIn, logout);

function login(req, res) {
    res.render("login");
}

function logout(req, res){
    req.logout();
    req.session.destroy();
    res.render("logout");
}

function register(req, res) {
    res.render("register");
}

function registerPost(req, res) {
    if(!req.body.uname || !req.body.pass)
       return res.render("register",{message:"Please provide username and password"});
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(req.body.pass, salt, function(err, hash){
            var user = {};
            user.firstname = req.body.fname;
            user.lastname = req.body.lname;
            user.email = req.body.email;
            user.username = req.body.uname;
            user.passwordHash = hash;  
            userRepo.addUser(user, function (err, index) {
                if (err)
                    return res.render("error", { message: err });
                else
                    return res.redirect("/login");
            });      
        });
    });
}

module.exports = router;