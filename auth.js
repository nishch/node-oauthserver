var passport = require("passport");
var bcrypt = require("bcrypt");
var LocalStrategy = require("passport-local");
var userRepo = require("./data/user");

passport.use(new LocalStrategy({
    usernameField: "uname",
    passwordField: "pass"
}, function (username, password, done) {
    userRepo.findUser(username, function (err, user) {
        if (err)
            return done(err);

        if (!user)
            return done(null, null);
            
        bcrypt.compare(password, user.passwordHash, function (err, matched) {
            if (matched)
                done(null, user);
            else
                done(null, null);
        });
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

exports.authenticate = passport.authenticate("local", { successRedirect: "/", failureRedirect: "/login", session: true });
exports.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated())
        next();
    else
        res.redirect("/login");
}