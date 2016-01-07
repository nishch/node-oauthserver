var authorizationCodes = [];

exports.saveCode = function (code, client, redirectUri, user, done) {
    var authCode = {
        code: code,
        clientId: client.id,
        redirectUri: redirectUri,
        username: user.username
    }
    authorizationCodes.push(authCode);
    done(null, authCode);
}

exports.find = function (code, done) {
    var authCode = null;
    authorizationCodes.filter(function (c) {
        if (c.code === code)
            authCode = c;
    });

    return done(null, authCode);
}