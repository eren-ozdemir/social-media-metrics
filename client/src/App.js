import DateForm from "./components/DateForm";
import Detailed from "./components/SingleSearch.js";
import Nav from "./components/Nav.js";
import SingleSearch from "./components/SingleSearch.js";
import SearchInput from "./components/SearchInput";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MultipleSearch from "./components/MultipleSearch";

function App() {
  const [socialMedia, setSocialMedia] = useState("youTube");
  const [startDate, setStartDate] = useState(new Date(2021, 6, 1));
  const [endDate, setEndDate] = useState(new Date(Date.now()));
  const [twitterDatas, setTwitterDatas] = useState([]);
  const [youTubeData, setYouTubeData] = useState([]);
  const [youTubeDatas, setYouTubeDatas] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMultiple, setIsMultiple] = useState(true);

  const handleResponse = (res) => {
    console.log("response");
  };

  return (
    <div className="App">
      <div className="container">
        <SearchInput
          socialMedia={socialMedia}
          setSocialMedia={setSocialMedia}
          handleResponse={handleResponse}
          twitterDatas={twitterDatas}
          youTubeDatas={youTubeDatas}
          setTwitterDatas={setTwitterDatas}
          setYouTubeDatas={setYouTubeDatas}
          setIsSearching={setIsSearching}
          isMultiple={isMultiple}
        />
        {/* <SingleSearch
        socialMedia={socialMedia}
        twitterData={twitterData}
        youTubeData={youTubeData}
        isSearching={isSearching}
      /> */}
        <MultipleSearch
          socialMedia={socialMedia}
          twitterDatas={twitterDatas}
          youTubeDatas={youTubeDatas}
        />
      </div>
    </div>
  );
}

export default App;
