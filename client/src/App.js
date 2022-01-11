import "./App.css";
import "./css/style.css";
import DateForm from "./components/DateForm";
import Twitter from "./components/Twitter";
import { useState, useEffect, useRef } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import YouTube from "./components/YouTube";
import { FaTwitter, FaYoutube } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [startDate, setStartDate] = useState(new Date(2021, 6, 1));
  const [endDate, setEndDate] = useState(new Date(Date.now()));
  const [socialMedia, setSocialMedia] = useState("twitter");
  const [twitterData, setTwitterData] = useState([]);
  const [youTubeData, setYouTubeData] = useState([]);
  const [popularTwitter, setPopularTwitter] = useState();
  const [popularYouTube, setPopularYouTube] = useState();
  const [twitterOptionList, setTwitterOptionList] = useLocalStorage(
    "twitter-option-list"
  );
  const [youTubeOptionList, setYouTubeOptionList] = useLocalStorage(
    "youTube-option-list"
  );

  const socialMediaVariants = {
    twitter: { backgroundColor: "#00acee" },
    youTube: { backgroundColor: "#990303" },
  };

  const navigatorVariants = {
    selected: { scale: 1.5 },
    notSelected: { scale: 1 },
  };

  useEffect(() => {
    if (!twitterOptionList) setTwitterOptionList([""]);
    if (!youTubeOptionList) setYouTubeOptionList([""]);
  }, [twitterOptionList, youTubeOptionList]);

  return (
    <div className="App">
      <motion.div
        className="container"
        animate={socialMedia}
        variants={socialMediaVariants}
      >
        <DateForm setStartDate={setStartDate} setEndDate={setEndDate} />
        <nav className="nav-bar-container">
          <motion.div
            animate={socialMedia === "twitter" ? "selected" : "notSelected"}
            variants={navigatorVariants}
            className={
              socialMedia === "twitter"
                ? "nav-item twitter-btn selected"
                : "nav-item twitter-btn "
            }
            onClick={() => setSocialMedia("twitter")}
          >
            <FaTwitter className="nav-icon" />
          </motion.div>
          <motion.div
            animate={socialMedia === "youTube" ? "selected" : "notSelected"}
            variants={navigatorVariants}
            className={
              socialMedia === "youTube"
                ? "nav-item youTube-btn selected"
                : "nav-item youTube-btn "
            }
            onClick={() => setSocialMedia("youTube")}
          >
            <FaYoutube className="nav-icon" />
          </motion.div>
        </nav>
        <motion.div
          className="social-media-container"
          animate={socialMedia}
          variants={socialMediaVariants}
        >
          {socialMedia === "twitter" && (
            <Twitter
              data={twitterData}
              setData={setTwitterData}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              optionList={twitterOptionList}
              setOptionList={setTwitterOptionList}
              popular={popularTwitter}
              setPopular={setPopularTwitter}
            />
          )}
          {socialMedia === "youTube" && (
            <YouTube
              data={youTubeData}
              setData={setYouTubeData}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              optionList={youTubeOptionList}
              setOptionList={setYouTubeOptionList}
              popular={popularYouTube}
              setPopular={setPopularYouTube}
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default App;
