var registeredClients = [{
    id: 1,
    name: "Fantastic App",
    clientId: "xyz234",
    clientSecret: "clientsecret",
    redirectUri: "http://localhost:7676/"
}];

exports.findClient = function (clientId, done) {
    var client = null;
    registeredClients.filter(function (c) {
        if (c.clientId === clientId)
            client = c;
    });
    return done(null, client);
}