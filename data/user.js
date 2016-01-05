var users = {};
var counter = 0;

exports.findUser = function (username, cb) {
    for (var id in users) {
        var user = users[id];
        if (user.username === username)
            return cb(null, user);
    }
    return cb(null, null);
}

exports.addUser = function (user, cb) {
    counter++;
    if (user) {
        users[counter] = user;
        return cb(null, counter);
    }
    return cb("Could not ass user");
}