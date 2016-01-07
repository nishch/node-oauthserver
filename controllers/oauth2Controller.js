var express = require("express");
var oauth2Provider = require("../oauth2Provider");
var router = express.Router();
router.route("/authorize").get(oauth2Provider.authorization);
router.route("/decision").post(oauth2Provider.decision);
router.route("/token").post(oauth2Provider.token);

module.exports = router;