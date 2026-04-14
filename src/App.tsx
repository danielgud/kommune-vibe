import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import LandingPage from "./pages/LandingPage";
import MemoryGame from "./pages/MemoryGame";
import Battleship from "./components/battleship/Battleship";
import Guesswho from "./components/guesswho/Guesswho";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/memory" element={<MemoryGame />} />
        <Route path="/battleship" element={<Battleship />} />
        <Route path="/guesswho" element={<Guesswho />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
};

export default App;