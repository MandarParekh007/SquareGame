
export function createRoom(userName,rooms,socket){

    const roomId = '' + Math.floor(Math.random() * 10000);
 
    const room = {
        roomId,
        players:[{
            userName,
            id:socket.id
        }]
    }

    rooms.push(room)

    socket.join(roomId)

    return room;

}

export function canJoinTheRoom(player2Data, socket, rooms) {
    const { roomId } = player2Data;

    const room = rooms.find((room) => room.roomId === roomId);

    if (!room) {
        return false; 
    }

    if (room.players?.length < 2) {
        room.players.push({ userName: player2Data.userName, id: socket.id });
        socket.join(roomId); 
        return true;
    }

    return false; 
}
