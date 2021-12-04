const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema(
    {
        name: {
            type: String,
        },
        author: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "User",
        },
        members: [{ type: mongoose.Types.ObjectId, ref: "User" }],
        messages: [{ type: mongoose.Types.ObjectId, ref: "Message" }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
