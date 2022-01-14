import DateForm from "./components/DateForm";
import Detailed from "./components/SingleSearch.js";
import Table from "./components/Table.js";
import Nav from "./components/Nav.js";
import SingleSearch from "./components/SingleSearch.js";
import SearchInput from "./components/SearchInput";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [startDate, setStartDate] = useState(new Date(2021, 6, 1));
  const [endDate, setEndDate] = useState(new Date(Date.now()));
  const [twitterData, setTwitterData] = useState([]);
  const [youTubeData, setYouTubeData] = useState([]);

  const handleResponse = (res) => {
    console.log("response");
  };

  return (
    <div className="App">
      <SearchInput
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        handleResponse={handleResponse}
      />
      {/* <SingleSearch /> */}
    </div>
  );
}

export default App;
