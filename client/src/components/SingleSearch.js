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
  twitterData,
  youTubeData,
  setTwitterData,
  setYouTubeData,
  isSearching,
}) {
  const [popularTwitter, setPopularTwitter] = useState();
  const [popularYouTube, setPopularYouTube] = useState();

  const socialMediaVariants = {
    twitter: { backgroundColor: "#00acee" },
    youTube: { backgroundColor: "#990303" },
  };

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
        {socialMedia === "twitter" && (
          <Twitter
            data={twitterData}
            setData={setTwitterData}
            popular={popularTwitter}
            setPopular={setPopularTwitter}
            isSearching={isSearching}
          />
        )}
        {socialMedia === "youTube" && (
          <YouTube
            data={youTubeData}
            setData={setYouTubeData}
            popular={popularYouTube}
            setPopular={setPopularYouTube}
            isSearching={isSearching}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

export default SingleSearch;
