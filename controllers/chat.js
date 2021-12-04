const Chats = require("../models/chat");
const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
// jsongfiy user to add info then go to send messages
const createChat = async (req, res) => {
    const { friendEmail, roomName } = req.body;
    const friend = await User.findOne({ email: friendEmail });
    if (!friend) {
        throw new CustomError.NotFound("User Not Found");
    }
    const existedChat = await Chats.findOne({
        members: [friend._id, req.user.userId],
    });
    if (existedChat) {
        throw new CustomError.BadRequest("Chat Already Exists");
    }
    if (friendEmail === req.user.email) {
        throw new CustomError.BadRequest("You Can't Chat With Yourself");
    }
    const chat = await Chats.create({
        name: roomName,
        members: [friend._id, req.user.userId],
        author: req.user.userId,
    });
    return res.status(StatusCodes.CREATED).json({ msg: "Chat Created", chat });
};

const getUserChats = async (req, res) => {
    const chats = await Chats.find({ members: req.user.userId }).populate(
        "members"
    );
    return res.status(StatusCodes.OK).json({ chats });
};

module.exports = {
    createChat,
    getUserChats,
};
