import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useNavigate } from "react-router";

function Home() {
  const [action, setAction] = useState(""); 
  const [inputValue, setInputValue] = useState(""); 
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("room-created", (data) => {
      const roomData = data.room;
      localStorage.setItem("roomId", roomData.roomId);
      localStorage.setItem("userName", roomData.players[0].userName);
      navigate("/waiting");
    });

    socket.on("play-game",(data) => {
      localStorage.setItem("player1",data.player1)
      localStorage.setItem("player2",data.player2)
      localStorage.setItem("score1",data.score1)
      localStorage.setItem("score2",data.score2)
      localStorage.setItem("roomId",data.user.roomId)
      localStorage.setItem("userName",data.user.userName)
      localStorage.setItem("turn",data.user.userName)
      navigate('/game')
    })

    return () => {
      socket.off("room-created");
      socket.off("play-game");
    };
  }, [navigate]);

  const handleCreateRoom = () => {
    if (!inputValue) return;
    socket.emit("create-room", { userName: inputValue });
    console.log("Creating room with name:", inputValue);
    setInputValue(""); 
  };

  const handleJoinRoom = () => {
    if (!inputValue || !roomId) return;
    console.log("Joining room with ID:", roomId, "as", inputValue);

    const player2Data = {
      userName: inputValue,
      roomId
    }

    socket.emit('join-room',{player2Data})
    
    setInputValue("");
    setRoomId("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="text-4xl font-bold mb-8 text-center">
        Welcome, To Square Game
      </div>
      <div className="flex flex-col space-y-6">
        {/* Create Room Button */}
        <button
          className="px-6 py-3 text-lg border-2 border-white rounded-md transition-transform duration-300 hover:bg-white hover:text-black hover:scale-105 hover:shadow-[0_0_10px_4px_rgba(255,255,255,0.8)]"
          onClick={() => setAction("create")}
        >
          Create Room
        </button>

        {/* Join Room Button */}
        <button
          className="px-6 py-3 text-lg border-2 border-white rounded-md transition-transform duration-300 hover:bg-white hover:text-black hover:scale-105 hover:shadow-[0_0_10px_4px_rgba(255,255,255,0.8)]"
          onClick={() => setAction("join")}
        >
          Join Room
        </button>
      </div>

      {/* Create Room Form */}
      {action === "create" && (
        <div className="mt-6">
          <input
            type="text"
            placeholder="Enter your name"
            className="px-4 py-2 text-black rounded-md focus:outline-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            required={true}
          />
          <button
            className="ml-4 px-6 py-2 bg-white text-black rounded-md transition-transform duration-300 hover:scale-105"
            onClick={handleCreateRoom}
          >
            Submit
          </button>
        </div>
      )}

      {/* Join Room Form */}
      {action === "join" && (
        <div className="mt-6 flex flex-col items-center space-y-4 p-4 border-2 rounded-md w-96">
          <input
            type="text"
            placeholder="Enter Your Name"
            className="px-4 py-2 w-full text-black rounded-md focus:outline-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Enter Room ID"
            className="px-4 py-2 w-full text-black rounded-md focus:outline-none"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
          />
          <button
            className="w-full px-6 py-2 bg-white text-black rounded-md transition-transform duration-300 hover:scale-105"
            onClick={handleJoinRoom}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
