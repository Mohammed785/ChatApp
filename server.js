require('dotenv').config()
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const {connect} = require('mongoose')
const app = express();
const server = http.createServer(app)
const io = socketIO(server)


app.use(express.json())

const notFound = async (req, res) => {
    res.status(404).json({ msg: "Route Not Found Check Url" })
}
app.use(notFound)

io.on('connection',(socket)=>{
    console.log('Welcome')
    socket.on('disconnect',()=>{
        console.log('GoodBay')
    })
})

const connectDB = connect(process.env.MONGO_URI)

try {
    server.listen(8000,()=>console.log('Server Started'))
} catch (error) {
    console.log(error)
}