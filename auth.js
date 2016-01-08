var passport = require("passport");
var bcrypt = require("bcrypt");

var LocalStrategy = require("passport-local").Strategy;
var BasicStrategy = require("passport-http").BasicStrategy;
var ClientPasswordStrategy = require("passport-oauth2-client-password").Strategy;
var BearerStrategy = require("passport-http-bearer").Strategy;

var userRepo = require("./data/user");
var clientRepo = require("./data/client");
var tokenRepo = require("./data/token");

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

passport.use(new BasicStrategy(function (username, password, done) {
    clientRepo.findClient(username, function (err, client) {
        if (err)
            return done(err);
        if (client.clientSecret === password)
            return done(null, client);
        return done(null, null);
    });
}));

passport.use(new ClientPasswordStrategy(function (clientId, clientSecret, done) {
    clientRepo.findClient(clientId, function (err, client) {
        if (err)
            return done(err);
        if (client.clientSecret === clientSecret)
            return done(null, client);
        return done(null, null);
    });
}));

passport.use(new BearerStrategy(function (token, done) {
    tokenRepo.find(token, function (err, accessToken) {
        if (err)
            return done(err);
        if (accessToken.username) {
            userRepo.findUser(accessToken.username, function (err, user) {
                if (err)
                    return done(err);
                if (!user)
                    return done(null, null);

                done(null, user, { scope: "*", isUser: true })
            });
        } else {
            clientRepo.findClient(accessToken.clientId, function (err, client) {
                if (err)
                    return done(err);
                if (!client)
                    return done(null, null);

                done(null, client, { scope: "*", isClient: true });
            });
        }
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

exports.authenticate = passport.authenticate("local", { successRedirect: "/", failureRedirect: "/login", session: true });
exports.authenticateClient = passport.authenticate(['basic', 'oauth2-client-password'], { session: false });

exports.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated())
        return next();
    else
        return res.redirect("/login");
}