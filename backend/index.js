import app from "./app.js"
import http from "http"
import { Server } from "socket.io"


const users = [];

const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin:"*"
    }
})



io.on('connection' ,(socket) => {
    console.log(socket.id)


})


server.listen(process.env.PORT || 8080,() => {
    console.log(`Server Is Running On Port ${process.env.PORT}`)
})