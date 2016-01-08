var express = require("express");
var passport = require("passport");
var router = express.Router();

router.route("/userResource").get(passport.authenticate("bearer", { session: false }), function (req, res) {
    res.send("Got it");
});

module.exports = router;