const router = require("express").Router();
const { sendMessage,getChatMessages,deleteMessage } = require("../controllers/messages");

router.route("/send/").post(sendMessage);
router.route("/get/chat-messages/:chatId/").get(getChatMessages);
router.route("/:id/delete/").delete(deleteMessage);

module.exports = router;
