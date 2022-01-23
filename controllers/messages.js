const Message = require("../models/message");
const { jsonMessage } = require("../utils/chat");
const { StatusCodes } = require("http-status-codes");

const sendMessage = async (req, res) => {
    const { msg, chatId } = req.body;
    const message = await Message.create({
        content: msg,
        sender: req.user.userId,
        chat: chatId,
    });
    global.io.emit("message", jsonMessage(message, req.user));
    return res.status(200).json({ msg: "Message Sent" });
};

const getChatMessages = async (req, res) => {
    const chatId = req.params.chatId;
    const messages = await Message.find({ chat: chatId }).populate("sender");
    return res.status(StatusCodes.OK).json({ messages });
};

const deleteMessage = async (req, res) => {
    const msgId = req.params.id;
    const msg = await Message.findByIdAndDelete(msgId);
    return res.status(StatusCodes.OK).json({ info: "Message Deleted", message: msg });
};

module.exports = {
    sendMessage,
    getChatMessages,
    deleteMessage,
};
