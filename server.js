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
const cookieParser = require('cookie-parser')
//routes
const authRoute = require("./routes/auth");

// middleware
const authMiddleware = require("./middlewares/auth");
const errorHandlerMiddleware = require("./middlewares/error_handler");
const notFound = async (req, res) => {
    res.status(404).json({ msg: "Route Not Found Check Url" });
};
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET))
app.use('/api/v1/auth',authRoute);
app.use(authMiddleware);
app.use(notFound);
app.use(errorHandlerMiddleware);

io.on("connection", (socket) => {
    console.log("Welcome");
    socket.on("disconnect", () => {
        console.log("GoodBay");
    });
});

const main = async () => {
    try {
        await connect(process.env.MONGO_URI);
        server.listen(8000, () => console.log("Server Started"));
    } catch (error) {
        console.log(error);
    }
};

main();
