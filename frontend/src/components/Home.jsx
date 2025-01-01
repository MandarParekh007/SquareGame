import { useState } from "react";
import { socket } from "../socket";

function Home() {
  const [action, setAction] = useState(""); // Tracks the current action ("create" or "join")
  const [inputValue, setInputValue] = useState(""); // Tracks input field value

  const handleCreateRoom = () => {
    // Handle room creation logic here
    console.log("Creating room with name:", inputValue);
    setInputValue(""); // Clear input after submission
  };

  const handleJoinRoom = () => {
    // Handle joining room logic here
    console.log("Joining room with ID:", inputValue);
    setInputValue(""); // Clear input after submission
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

      
      {action === "create" && (
        <div className="mt-6">
          <input
            type="text"
            placeholder="Enter your name"
            className="px-4 py-2 text-black rounded-md focus:outline-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            className="ml-4 px-6 py-2 bg-white text-black rounded-md transition-transform duration-300 hover:scale-105"
            onClick={handleCreateRoom}
          >
            Submit
          </button>
        </div>
      )}

      {action === "join" && (
        <div className="mt-6">
          <input
            type="text"
            placeholder="Enter room ID"
            className="px-4 py-2 text-black rounded-md focus:outline-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            className="ml-4 px-6 py-2 bg-white text-black rounded-md transition-transform duration-300 hover:scale-105"
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
