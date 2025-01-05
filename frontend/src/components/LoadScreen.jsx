import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useNavigate } from "react-router";


function LoadScreen() {

    const navigate = useNavigate();

    useEffect(() => {
        socket.on('play-game',(data) => {
          localStorage.setItem("player1",data.player1)
          localStorage.setItem("player2",data.player2)
          localStorage.setItem("score1",data.score1)
          localStorage.setItem("score2",data.score2)
          localStorage.setItem("turn",data.turn)
            navigate('/game')
        })

        return () => {
            socket.off('play-game')
        }
    },[])

    const [user2,setUser2] = useState("")

    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white">
        {/* Top-left: User Info */}
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-black font-bold">
            {localStorage.getItem("userName").charAt(0).toUpperCase()}
          </div>
          <span className="text-lg font-medium">{localStorage.getItem("userName")}</span>
        </div>
  
        {/* Top-center: Room ID */}
        <div className="absolute top-4 text-center">
          <span className="text-xl font-semibold">Room ID: {localStorage.roomId}</span>
        </div>
        {user2 && (
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-black font-bold">
            {localStorage.getItem("userName").charAt(0).toUpperCase()}
          </div>
          <span className="text-lg font-medium">{localStorage.getItem("userName")}</span>
        </div>
        )}
  
        {/* Center: Loading Spinner */}
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-t-white border-gray-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  export default LoadScreen;
  