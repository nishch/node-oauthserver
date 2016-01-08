var registeredClients = [{
    id: 1,
    name: "Fantastic App",
    clientId: "xyz234",
    clientSecret: "clientsecret",
    redirectUri: "http://localhost:7676/"
}];

exports.findClient = function (clientId, done) {
    var client = registeredClients.filter(function (c) {
        return c.clientId === clientId;
    })[0];
    
    return done(null, client);
}