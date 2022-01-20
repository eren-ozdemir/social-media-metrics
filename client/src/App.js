import { useState } from "react";
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";
import SearchInput from "./components/SearchInput";
import MultipleSearch from "./components/MultipleSearch";
import Twitter from "./components/Twitter";
import YouTube from "./components/YouTube";

function App() {
  const [socialMedia, setSocialMedia] = useState("twitter");
  const [twitterDatas, setTwitterDatas] = useState([]);
  const [youTubeDatas, setYouTubeDatas] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [detailIndex, setDetailIndex] = useState();
  const [queryList, setQueryList] = useState([]);

  return (
    <AnimateSharedLayout>
      <motion.div className="App">
        <AnimatePresence exitBeforeEnter>
          {!isDetailsVisible ? (
            <motion.div
              className="container"
              key={isDetailsVisible}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <SearchInput
                socialMedia={socialMedia}
                setSocialMedia={setSocialMedia}
                twitterDatas={twitterDatas}
                youTubeDatas={youTubeDatas}
                setTwitterDatas={setTwitterDatas}
                setYouTubeDatas={setYouTubeDatas}
                setIsSearching={setIsSearching}
                queryList={queryList}
                setQueryList={setQueryList}
              />
              {
                <MultipleSearch
                  socialMedia={socialMedia}
                  isSearching={isSearching}
                  twitterDatas={twitterDatas}
                  youTubeDatas={youTubeDatas}
                  setIsDetailsVisible={setIsDetailsVisible}
                  setDetailIndex={setDetailIndex}
                />
              }
            </motion.div>
          ) : (
            <motion.div
              className="container"
              key={isDetailsVisible}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimateSharedLayout>
  );
}

export default App;
