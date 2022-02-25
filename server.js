require("dotenv").config();
require("express-async-errors");
// packages
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const { connect } = require("mongoose");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const cookieParser = require("cookie-parser");
//routes
const authRoute = require("./routes/auth");
const chatRoute = require("./routes/chat");
const messageRoute = require("./routes/messages");
const userRoute = require("./routes/user");
// middleware
const authMiddleware = require("./middlewares/auth");
const errorHandlerMiddleware = require("./middlewares/error_handler");
const { join } = require("path");
const notFound = async (req, res) => {
    res.status(404).json({ msg: "Route Not Found Check Url" });
};
app.get("/auth",async(req,res)=>{
    return res.sendFile(join(__dirname,"static","auth.html"))
})
app.get("/",async(req,res)=>{
    return res.sendFile(join(__dirname,"static","index.html"))
})
app.use(express.json());
app.use(express.static("static"));
app.use(cookieParser(process.env.JWT_SECRET));
app.use("/api/v1/auth", authRoute);
app.use(authMiddleware);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/user", userRoute);
app.use(notFound);
app.use(errorHandlerMiddleware);

io.on("connection", (socket) => {
    socket.emit("check", () => {
        console.log("checking");
    });
    socket.on("disconnect", () => {
        console.log("GoodBay");
    });
});
const main = async () => {
    try {
        await connect(process.env.MONGO_URI);
        global.io = io;
        server.listen(8000, () => console.log("Server Started"));
    } catch (error) {
        console.log(error);
    }
};

main();
