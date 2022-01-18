import DateForm from "./components/DateForm";
import Detailed from "./components/SingleSearch.js";
import Nav from "./components/Nav.js";
import SingleSearch from "./components/SingleSearch.js";
import SearchInput from "./components/SearchInput";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MultipleSearch from "./components/MultipleSearch";
import Twitter from "./components/Twitter";
import YouTube from "./components/YouTube";

function App() {
  const [socialMedia, setSocialMedia] = useState("youTube");
  const [startDate, setStartDate] = useState(new Date(2021, 6, 1));
  const [endDate, setEndDate] = useState(new Date(Date.now()));
  const [twitterData, setTwitterData] = useState([]);
  const [twitterDatas, setTwitterDatas] = useState([]);
  const [youTubeData, setYouTubeData] = useState([]);
  const [youTubeDatas, setYouTubeDatas] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [detailIndex, setDetailIndex] = useState();

  const handleResponse = (res) => {
    console.log("response");
  };

  return (
    <div className="App">
      <div className="container">
        {!isDetailsVisible ? (
          <>
            <SearchInput
              socialMedia={socialMedia}
              setSocialMedia={setSocialMedia}
              handleResponse={handleResponse}
              twitterDatas={twitterDatas}
              youTubeDatas={youTubeDatas}
              setTwitterDatas={setTwitterDatas}
              setYouTubeDatas={setYouTubeDatas}
              setIsSearching={setIsSearching}
            />

            <MultipleSearch
              socialMedia={socialMedia}
              twitterDatas={twitterDatas}
              youTubeDatas={youTubeDatas}
              setIsDetailsVisible={setIsDetailsVisible}
              setDetailIndex={setDetailIndex}
            />
          </>
        ) : (
          <>
            {socialMedia === "twitter" ? (
              <Twitter
                data={twitterDatas[detailIndex].data}
                username={twitterDatas[detailIndex].meta.username}
                setIsDetailsVisible={setIsDetailsVisible}
              />
            ) : (
              <YouTube
                data={youTubeDatas[detailIndex].videos}
                channelName={youTubeDatas[detailIndex].channelName}
                setIsDetailsVisible={setIsDetailsVisible}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
