var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var path = require("path");
var passport = require("passport");
var login = require("connect-ensure-login");

var accountController = require("./controllers/accountController");
var oauth2Controller = require("./controllers/oauth2Controller");
var auth = require("./auth");

var app = express();
app.set("view engine", "vash");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "www")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(accountController);
app.use("/oauth", oauth2Controller);

var port = 7676;

app.get("/", auth.isLoggedIn, function (req, res) {
    res.render("index");
});

app.listen(port, function () {
    console.log("Started listening on port", port);
});