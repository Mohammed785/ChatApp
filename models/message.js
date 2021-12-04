const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, "Please Enter A Message"],
        },
        sender: {
            type: mongoose.Types.ObjectId,
            required: [true, "Anonymous Users Cant Send Messages"],
            ref: "User",
        },
        chat:{
            type:mongoose.Types.ObjectId,
            required:true,
            ref:'Chat'
        }
    },
    { timestamps: true }
);


module.exports = mongoose.model('Message',MessageSchema)