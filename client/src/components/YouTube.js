import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Options from "./Options";
import { AiOutlineEye, AiOutlineHeart } from "react-icons/ai";
import { FaComment, FaRegComment, FaThumbsUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { IconContext } from "react-icons";

const YouTube = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  optionList,
  setOptionList,
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [publicMetricSums, setPublicMetricSums] = useState({
    likeCount: 0,
    viewCount: 0,
    commentCount: 0,
  });
  const youTubeUsernameRef = useRef();
  const [youTubeData, setYouTubeData] = useState();
  const [youTubeDataFiltered, setYouTubeDataFiltered] = useState();
  const [data, setData] = useState();

  useEffect(() => {
    if (startDate) filterByDate();
  }, [startDate, endDate]);

  useEffect(() => {
    if (!isSearching)
      setData(youTubeDataFiltered?.length ? youTubeDataFiltered : youTubeData);
  }, [data, youTubeData, youTubeDataFiltered]);

  //Get sum of metrics
  useEffect(() => {
    if (data) {
      const tempPublicMetricSums = new Object();
      for (const metric in data[0]?.statistics) {
        tempPublicMetricSums[metric] = 0;
      }

      data.map((share) => {
        for (const metric in share.statistics) {
          tempPublicMetricSums[metric] += Number(share.statistics[metric]);
        }
      });
      setPublicMetricSums(tempPublicMetricSums);
    }
  }, [data]);

  const searchYouTube = async () => {
    setIsSearching(true);
    setData([]);
    try {
      const res = await axios.get("/youtube/public", {
        params: {
          channelName: youTubeUsernameRef.current.value,
          start_time: startDate,
          end_time: endDate,
        },
      });
      setYouTubeData(res.data);
      const start = res.data[res.data?.length - 1].snippet.publishedAt;
      setStartDate(new Date(start));
      setIsSearching(false);
    } catch (err) {
      console.log(err);
      setIsSearching(false);
    }
  };

  const filterByDate = () => {
    const tempYouTubeDataFiltered = youTubeData?.filter((share) => {
      const shareDate = new Date(share.snippet.publishedAt);
      return shareDate >= startDate && shareDate <= endDate;
    });
    tempYouTubeDataFiltered &&
      setYouTubeDataFiltered([...tempYouTubeDataFiltered]);
  };

  const setInput = (_selected) => {
    youTubeUsernameRef.current.value = _selected;
  };

  const addOption = () => {
    if (!optionList?.includes(youTubeUsernameRef.current?.value)) {
      setOptionList([...optionList, youTubeUsernameRef.current?.value]);
    }
  };

  const removeOption = () => {
    if (optionList.includes(youTubeUsernameRef.current?.value)) {
      const arr = optionList.filter(
        (option) => option !== youTubeUsernameRef.current?.value
      );
      setOptionList([...arr]);
    }
  };

  const getSum = (arr) => {
    let total = 0;
    for (let item in arr) {
      total += arr[item];
    }
    return total;
  };

  return (
    <IconContext.Provider
      value={{ color: "white", className: "icon", fontWeight: "bold" }}
    >
      <div className="social-media-item">
        <div className="search-box-container">
          <div className="search-input">
            <input
              type="input"
              ref={youTubeUsernameRef}
              placeholder="Kanal Adı"
            />
            <div className="btn" onClick={searchYouTube}>
              <div className="underline"></div>
              Ara
            </div>
          </div>
          <div className="options-container">
            <Options setInput={setInput} optionList={optionList} />
            <div className="btn" onClick={addOption}>
              <div className="underline"></div>
              Ekle
            </div>
            <div className="btn" onClick={removeOption}>
              <div className="underline"></div>
              Sil
            </div>
          </div>
        </div>
        <AnimatePresence>
          <motion.div
            className="metrics sums"
            initial={{ backgroundColor: "#00acee" }}
            animate={{ backgroundColor: "#990303" }}
          >
            <div>
              Gönderi Sayısı:
              <p className="metric">{data?.length ? data.length : 0}</p>
            </div>
            <div>
              Toplam Etkileşim:
              <p className="metric">{getSum(publicMetricSums)}</p>
            </div>
            <div>
              <AiOutlineHeart />
              <p className="metric">{publicMetricSums["likeCount"]}</p>
            </div>
            <div>
              <FaRegComment />
              <p className="metric">{publicMetricSums["commentCount"]}</p>
            </div>
            <div>
              <AiOutlineEye />
              <p className="metric">{publicMetricSums["viewCount"]}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {!data?.length ? (
          <div className="no-data">{isSearching ? "Aranıyor" : "Veri Yok"}</div>
        ) : (
          data?.map((share, index) => {
            return (
              <div className="share-container" key={share.id}>
                <div className="share-index">
                  <p>{index + 1}</p>
                </div>
                <div className="share">
                  <a
                    href={`http://www.youtube.com/watch?v=${share.id}`}
                    target="_blank"
                  >
                    <div className="youtube-content">
                      <img
                        className="thumbnail"
                        src={share.snippet.thumbnails.medium.url}
                      />
                      <div>
                        <p className="title">{share.snippet.title}</p>
                        <br />
                        <p className="title">{share.snippet.channelTitle}</p>
                      </div>
                    </div>
                  </a>
                  <div className="meta-data">
                    <div className="metrics">
                      <div>
                        <AiOutlineHeart />
                        <p className="metric">
                          {share.statistics["likeCount"]}
                        </p>
                      </div>
                      <div>
                        <FaRegComment />
                        <p className="metric">
                          {share.statistics["commentCount"]}
                        </p>
                      </div>
                      <div>
                        <AiOutlineEye />
                        <p className="metric">
                          {share.statistics["viewCount"]}
                        </p>
                      </div>
                    </div>
                    <p className="share-date">
                      {new Date(share.snippet.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </IconContext.Provider>
  );
};

export default YouTube;
