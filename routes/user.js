const router = require("express").Router();
const { userInfo, userSearch } = require("../controllers/user");

router.route("/info").get(userInfo);
router.route("/find/:email").get(userSearch);

module.exports = router;
