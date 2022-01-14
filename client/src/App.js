import DateForm from "./components/DateForm";
import Detailed from "./components/SingleSearch.js";
import Table from "./components/Table.js";
import Nav from "./components/Nav.js";
import SingleSearch from "./components/SingleSearch.js";
import SearchInput from "./components/SearchInput";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [socialMedia, setSocialMedia] = useState("twitter");
  const [startDate, setStartDate] = useState(new Date(2021, 6, 1));
  const [endDate, setEndDate] = useState(new Date(Date.now()));
  const [twitterData, setTwitterData] = useState([]);
  const [youTubeData, setYouTubeData] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleResponse = (res) => {
    console.log("response");
  };

  return (
    <div className="App">
      <SearchInput
        socialMedia={socialMedia}
        setSocialMedia={setSocialMedia}
        handleResponse={handleResponse}
        setTwitterData={setTwitterData}
        setYouTubeData={setYouTubeData}
        setIsSearching={setIsSearching}
      />
      <SingleSearch
        socialMedia={socialMedia}
        twitterData={twitterData}
        youTubeData={youTubeData}
        isSearching={isSearching}
      />
    </div>
  );
}

export default App;
