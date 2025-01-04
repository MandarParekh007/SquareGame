import { Route, Router, Routes } from "react-router-dom";
import Home from "./components/Home";
import LoadScreen from "./components/LoadScreen";
import GameScreen from "./components/GameScreen";


function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/waiting" element={<LoadScreen />}></Route>
        <Route path="/game" element={<GameScreen />}></Route>
      </Routes>
  );
}

export default App;
