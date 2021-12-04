const socket = io();
const form = document.getElementById("msg-form");
const searchForm = document.getElementById("search-form");
const chatArea = document.querySelector(".chat-area-main");
const conversionArea = document.getElementById("friends-chats");
const logoutBtn = document.getElementById("logout");
var friendsChats = null;
var currentChat = null;
var userInfo = null;

socket.on("check", () => {
    getUserInfo().then((data) => {
        getUserChats().then((chats) => {
            handleUserChats(chats).then(() => {
                friendsChats = document.querySelectorAll(".chat");
                friendsChats.forEach((chat) => {
                    chat.addEventListener("click", function (e) {
                        loadChatMsgs($(this).attr("id"));
                        currentChat = $(this).attr("id");
                    });
                });
            });
        });
    });
});

socket.on("message", (data) => {
    const msg = createMessage(data);
    chatArea.innerHTML += msg;
    smoothScroll();
});

const createMessage = (data) => {
    let style =
        data?.sender?.email !== userInfo.email ? "chat-msg" : "chat-msg owner";
    if (data?.userEmail) {
        style =
            data.userEmail !== userInfo.email ? "chat-msg" : "chat-msg owner";
    }
    return `<div class="${style}" data-id=${data.id}>
     <div class="chat-msg-profile">
      <div class="chat-msg-date">Message sent ${new Date(
          data.createdAt
      ).toLocaleString()}</div>
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

const getUserInfo = () => {
    return $.ajax({
        method: "GET",
        url: "/api/v1/user/info",
        success: (data) => {
            userInfo = data;
        },
        error: (error) => {
            console.error(error);
            window.location.href = "/auth.html";
        },
    });
};
const getUserChats = () => {
    return $.ajax({
        method: "GET",
        url: "/api/v1/chat/find/user-chats",
        error: (error) => {
            console.error(error);
        },
    });
};

const handleUserChats = (chats) => {
    return new Promise((resolve, reject) => {
        if (chats.length === 0) {
            conversionArea.innerHTML = `<div class='no-chats'><p>No Chats Found Add One</p></div>`;
            return reject();
        }
        let data = chats.chats
            .map((chat) => {
                return `<div class="msg chat" id="${chat._id}">
              <!-- <img class="msg-profile" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png"/> -->
 
    <div class="msg-detail">
     <div class="msg-username">${
         chat.members.find((member, index) => {
             if (member._id !== userInfo.userId) {
                 return true;
             }
         }).username
     }</div>
     <div class="msg-content">
      <!----<span class="msg-message">What time was our meet</span>
      <span class="msg-date">20m</span>---->
     </div>
    </div>
   </div>`;
            })
            .join("");
        conversionArea.innerHTML = data;
        return resolve();
    });
};
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
    const data = msgs.messages
        .map((chat) => {
            return createMessage(chat);
        })
        .join("");
    chatArea.innerHTML = data;
    chatArea.scrollTop = chatArea.scrollHeight;
    smoothScroll();
};

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
            console.log(data);
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
