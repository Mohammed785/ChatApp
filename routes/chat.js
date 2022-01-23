const router = require("express").Router();
const { createChat, getUserChats , deleteChat } = require("../controllers/chat");

router.route("/create").post(createChat);
router.route("/find/user-chats").get(getUserChats);
router.route("/:id/delete").delete(deleteChat);

module.exports = router;
