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

exports.find = function (accessToken, done) {
    var token = tokens.filter(function (t) {
        return t.token === accessToken;
    })[0];

    return done(null, token);
}