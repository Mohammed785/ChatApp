const jsonChat = (chat) => {
    return { id: chat._id, name: chat.name };
};

const jsonMessage = (message, user) => {
    return {
        id: message._id,
        content: message.content,
        createdAt: message.createdAt,
        username: user.name,
        userEmail: user.email,
        chat:message.chat
    };
};

module.exports = {
    jsonChat,
    jsonMessage,
};
