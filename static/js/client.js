const socket = io();
const form = document.getElementById("msg-form");
const searchForm = document.getElementById("search-form");
const chatArea = document.querySelector(".chat-area-main");
const conversionArea = document.getElementById("friends-chats");
const logoutBtn = document.getElementById("logout");
let friendsChats = null;
let currentChat = null;
let userInfo = null;

const chatEvents = ()=>{
    friendsChats = document.querySelectorAll(".chat");
    deleteChatsA = document.querySelectorAll(".del-x")
    friendsChats.forEach((chat) => {
        chat.addEventListener("click", function (e) {
            loadChatMsgs($(this).attr("id"));
            currentChat = $(this).attr("id");
            chat.children[1].children[1].innerHTML='';
        });
    });
    
    deleteChatsA.forEach((a) => {
        a.addEventListener("click", function (e) {
            const chatId= $(this.parentElement).attr("id");
            deleteChatApi(chatId).then(conversionArea.removeChild(this.parentElement));
        });
    });
}
//socket
socket.on("check", () => {
    getUserInfo().then((data) => {
        handleChatLogic()
    });
});

socket.on('newChat',(data)=>{
    console.log(data);
    if(data.members[1]._id==userInfo.userId){
        console.log("added");
        conversionArea.innerHTML+= addUserChat(data)
        chatEvents()
    }
})
//messages
socket.on("message", (data) => {
    const msg = createMessage(data);
    if (data.chat === currentChat) {
        chatArea.innerHTML += msg;
    } else {
        const chat = document.getElementById(data.chat);
        if(chat){
            chat.children[1].children[1].innerHTML = `<span class="msg-message">${data.content}</span>`;
        }
        else{
            handleChatLogic()
        }
    }
    smoothScroll();
});

const createMessage = (data) => {
    let style = data?.sender?.email !== userInfo.email ? "chat-msg" : "chat-msg owner";
    if (data?.userEmail) {
        style = data.userEmail !== userInfo.email ? "chat-msg" : "chat-msg owner";
    }
    return `<div class="${style}" data-id=${data.id}>
     <div class="chat-msg-profile">
      <div class="chat-msg-date">Message sent ${new Date(data.createdAt).toLocaleString()}</div>
     </div>
     <div class="chat-msg-content">
      <div class="chat-msg-text">${data.content}</div>   
     </div>
    </div>`;
};

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    $.ajax({
        method: "POST",
        contentType: "application/json",
        url: "/api/v1/message/send",
        data: JSON.stringify({
            msg: msg,
            chatId: currentChat,
        }),
        success: (data) => {
            e.target.elements.msg.value = "";
            e.target.elements.msg.focus();
        },
        error: (error) => {
            console.error(error);
        },
    });
});

const loadChatMsgs = (chatId) => {
    $.ajax({
        method: "GET",
        url: `/api/v1/message/get/chat-messages/${chatId}/`,
        success: (data) => {
            handelChatMsgs(data);
        },
        error: (err) => {
            console.error(err);
        },
    });
};

const handelChatMsgs = (msgs) => {
    const data = msgs.messages.map((chat) => { return createMessage(chat) }).join("");
    chatArea.innerHTML = data;
    chatArea.scrollTop = chatArea.scrollHeight;
    smoothScroll();
};
//user info
const getUserInfo = () => {
    return $.ajax({
        method: "GET",
        url: "/api/v1/user/info",
        success: (data) => {
            userInfo = data;
        },
        error: (error) => {
            console.error(error);
            window.location.href = "/auth";
        },
    });
};
//chats
const getUserChats = () => {
    return $.ajax({
        method: "GET",
        url: "/api/v1/chat/find/user-chats",
        error: (error) => {
            console.error(error);
        },
    });
};

const addUserChat = (chat) => {
    return `<div class="msg chat" id="${chat._id}">
            <a href="#" class="del-x">X</a>
            <div class="msg-detail">
            <div class="msg-username">${
                chat.members.find((member, index) => {
                    if (member._id !== userInfo.userId) {
                        return true;
                    }
                }).username}</div>
            <div class="msg-content">
            </div>
            </div>
        </div>`;
};

const deleteChatApi = (id) =>{
    return $.ajax({
        method: "DELETE",
        url: `/api/v1/chat/${id}/delete`,
        error: (error) => {
            console.error(error);
        },
    });
}
const handleUserChats = (chats) => {
    return new Promise((resolve, reject) => {
        if (chats.length === 0) {
            conversionArea.innerHTML = `<div class='no-chats'><p>No Chats Found Add One</p></div>`;
            return reject();
        }
        const data = chats.chats.map((chat) => {return addUserChat(chat)}).join("");
        conversionArea.innerHTML = data;
        return resolve();
    });
};
const handleChatLogic = ()=>{
    getUserChats().then((chats) => {
        handleUserChats(chats).then(() => {
            chatEvents();
        });
    });
}

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userEmail = e.target.elements.email.value;
    $.ajax({
        method: "POST",
        url: `/api/v1/chat/create`,
        contentType: "application/json",
        data: JSON.stringify({
            friendEmail: userEmail,
        }),
        success: (data) => {
            handleChatLogic()
        },
        error: (error) => {
            console.error(error);
        },
    });
});

logoutBtn.addEventListener("click", (e) => {
    $.ajax({
        method: "POST",
        url: `/api/v1/auth/logout`,
        success: () => {
            window.location.href = "auth.html";
        },
        error: (error) => {
            console.error(error);
        },
    });
});
const smoothScroll = () => {
    $("#chat-cont").animate(
        { scrollTop: $("#chat-cont")[0].scrollHeight },
        1000
    );
};
const toggleButton = document.querySelector(".dark-light");
const colors = document.querySelectorAll(".color");

colors.forEach((color) => {
    color.addEventListener("click", (e) => {
        colors.forEach((c) => c.classList.remove("selected"));
        const theme = color.getAttribute("data-color");
        document.body.setAttribute("data-theme", theme);
        color.classList.add("selected");
    });
});

toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});
