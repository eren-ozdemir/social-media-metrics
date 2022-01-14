import "../css/style.css";
import { useState, useEffect } from "react";
import DateForm from "./DateForm";
import Twitter from "./Twitter";
import YouTube from "./YouTube";
import useLocalStorage from "../hooks/useLocalStorage";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "./Nav";

function SingleSearch({
  socialMedia,
  setSocialMedia,
  twitterOptionList,
  youTubeOptionList,
}) {
  const [popularTwitter, setPopularTwitter] = useState();
  const [popularYouTube, setPopularYouTube] = useState();

  const socialMediaVariants = {
    twitter: { backgroundColor: "#00acee" },
    youTube: { backgroundColor: "#990303" },
  };

  useEffect(() => {
    if (!twitterOptionList) setTwitterOptionList([""]);
    if (!youTubeOptionList) setYouTubeOptionList([""]);
  }, [twitterOptionList, youTubeOptionList]);

  return (
    <motion.div
      className="container"
      animate={socialMedia}
      variants={socialMediaVariants}
    >
      <motion.div
        className="social-media-container"
        animate={socialMedia}
        variants={socialMediaVariants}
      >
        {/* {socialMedia === "twitter" && (
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
        )} */}
      </motion.div>
    </motion.div>
  );
}

export default SingleSearch;
