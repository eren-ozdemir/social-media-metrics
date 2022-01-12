import Detailed from "./components/Detailed.js";
import { useState, useEffect, useRef } from "react";
import useLocalStorage from "./hooks/useLocalStorage";

function App() {
  return (
    <div className="App">
      <Detailed></Detailed>
    </div>
  );
}

export default App;
