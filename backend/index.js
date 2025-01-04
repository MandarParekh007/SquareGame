import app from "./app.js"
import http from "http"
import { Server } from "socket.io"
import { canJoinTheRoom, createRoom } from "./controllers/socketutils.js";

const rooms = [];

const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin:process.env.FRONTEND_URL
    }
})



io.on('connection' ,(socket) => {
    console.log(socket.id)

    socket.on('create-room',(data) => {
        const {userName} = data;
        const room = createRoom(userName, rooms, socket);
        socket.emit('room-created',{room})

    })

    socket.on('join-room', async (data) => {
        if (canJoinTheRoom(data.player2Data, socket, rooms)) {
            const room = rooms.filter((room) => room.roomId == data.player2Data.roomId)[0]
            console.log(room.players)
            io.to(data.player2Data.roomId).emit('play-game', {user: data.player2Data, turn: data.player2Data.userName,player1: room.players[0].userName,player2: room.players[1].userName,score1:0,score2: 0});
        } else {
            socket.emit('error', { message: 'Unable to join the room' });
        }
    });

    socket.on('move-played-square',({lines,scores,roomId,userName}) => {
        // const room = rooms.filter((room) => room.roomId == roomId)[0]
        // const turnName = room.players.find((player) => player.userName != userName)[0].userName
        console.log(scores)
        io.to(roomId).emit("update-game",{lines,scores,roomId,turn:userName})
    })

    socket.on('move-played',({lines,scores,roomId,userName}) => {

        const room = rooms.filter((room) => room.roomId == roomId)[0]
        // console.log(room)
        const turnName = room.players.filter((player) => player.userName != userName)[0].userName
        // console.log(turnName)
        io.to(roomId).emit('update-game',{lines,scores,roomId,turn:turnName})
    })

})


server.listen(process.env.PORT || 8080,() => {
    console.log(`Server Is Running On Port ${process.env.PORT}`)
})