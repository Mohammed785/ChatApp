const router = require('express').Router();
const {createChat,getUserChats} = require('../controllers/chat')

router.route('/create').post(createChat)
router.route('/find/user-chats').get(getUserChats)

module.exports = router