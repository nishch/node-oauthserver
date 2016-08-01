var oauth2orize = require("oauth2orize");
var crypto = require("crypto");
var auth = require("./auth");
var clientRepo = require("./data/client");
var codeRepo = require("./data/code");
var tokenRepo = require("./data/token");
var oauthServer = oauth2orize.createServer();
var login = require('connect-ensure-login');

oauthServer.serializeClient(function (client, done) {
    done(null, client.clientId);
});

oauthServer.deserializeClient(function (clientId, done) {
    clientRepo.findClient(clientId, function (err, client) {
        if (err)
            return done(err);
        done(null, client);
    });
});

//***Configure oauth2.0 Authorization Code flow***
//1. Register "code" grant
oauthServer.grant(oauth2orize.grant.code(function (client, redirectUri, user, ares, done) {
    crypto.randomBytes(16, function (err, buffer) {
        if (err)
            return done(err);
        var code = buffer.toString("base64");
        codeRepo.saveCode(code, client, redirectUri, user, function (err, authCode) {
            if (err)
                return done(err);
            return done(null, code);
        });
    });
}));
//2. Register code exchage to get token
oauthServer.exchange(oauth2orize.exchange.code(function (client, code, redirectUri, done) {
    codeRepo.find(code, function (err, authCode) {
        if (err) { return done(err); }
        if (client.id !== authCode.clientId) { return done(null, false); }
        if (redirectUri !== authCode.redirectUri) { return done(null, false); }
        
        crypto.randomBytes(256, function(err, buffer){
           var token = buffer.toString("base64");
           tokenRepo.save(token, authCode.username, authCode.clientId, function(err){
                if (err) { return done(err); }
                return done(null, token);   
           });
        });
    });
}));

//This middleware will be called in case of "Authorization Code flow" and "Immplicite grant flow"
//based on the response_type parameter's value which can be "code" or "token" one of the above grant will be executed
exports.authorization = [
    auth.isLoggedIn,
    oauthServer.authorization(function (clientID, redirectURI, done) {
        clientRepo.findClient(clientID, function (err, client) {
            if (err)
                return done(err);
            if (client.redirectUri !== redirectURI)
                return done(null, null, redirectURI);
            return done(null, client, redirectURI);
        });
    }),
    function (req, res) {
        res.render("consent", { transactionId: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
    }
]

exports.decision = [
    auth.isLoggedIn,
    oauthServer.decision()
]

// This middleware will be called while exchanging the grant in case of "Authorization Code Flow","Resource owners credentials flow" and
// Client credentials flow.
exports.token = [
    auth.authenticateClient,
    oauthServer.token(),
    oauthServer.errorHandler()
]