var tokens = [];

exports.save = function (token, username, clientId, done) {
    var tokenInfo = {
        token: token,
        username: username,
        clientId: clientId
    }

    tokens.push(tokenInfo);
    done(null);
}