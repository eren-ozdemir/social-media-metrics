import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Options from "./Options";
import { AiOutlineRetweet, AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { motion } from "framer-motion";

const Twitter = ({
  data,
  setData,
  startDate,
  setStartDate,
  endDate,
  optionList,
  setOptionList,
  popular,
  setPopular,
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [publicMetricSums, setPublicMetricSums] = useState({
    like_count: 0,
    retweet_count: 0,
    comment_count: 0,
  });
  const [twitterData, setTwitterData] = useState();
  const [twitterDataFiltered, setTwitterDataFiltered] = useState();
  const hoverVariants = {
    hover: { backgroundColor: "#02678f" },
  };

  useEffect(() => {
    if (startDate) filterByDate();
  }, [startDate, endDate]);

  useEffect(() => {
    if (!isSearching && twitterData) {
      setData(twitterDataFiltered ? twitterDataFiltered : twitterData);
    }
  }, [data, twitterData, twitterDataFiltered]);

  useEffect(() => {
    if (data) {
      const tempPublicMetricSums = new Object();
      for (const metric in data[0]?.public_metrics) {
        tempPublicMetricSums[metric] = 0;
      }

      data.map((tweet) => {
        for (const metric in tweet.public_metrics) {
          tempPublicMetricSums[metric] += tweet.public_metrics[metric];
        }
      });
      setPublicMetricSums(tempPublicMetricSums);
    }
  }, [data]);

  const findPopular = (_data) => {
    let popularIndex = 0;
    let popularSum = 0;
    _data.map((share, index, arr) => {
      let sum = 0;
      for (const metric in share?.public_metrics) {
        if (metric !== "quote_count") sum += share.public_metrics[metric];
      }
      share.public_metrics.sum = sum;
      if (sum > popularSum) {
        popularSum = sum;
        popularIndex = index;
      }
    });
    setPopular(popularIndex);
  };

  const filterByDate = () => {
    const tempTwitterDataFiltered = twitterData?.filter((tweet) => {
      const tweetDate = new Date(tweet.created_at);
      return tweetDate >= startDate && tweetDate <= endDate;
    });
    tempTwitterDataFiltered &&
      setTwitterDataFiltered([...tempTwitterDataFiltered]);
  };

  const getSum = (arr) => {
    let total = 0;
    for (let item in arr) {
      total += arr[item];
    }
    return total;
  };

  return (
    <div className="social-media-item">
      <motion.div
        className="metrics sums"
        initial={{ backgroundColor: "#990303" }}
        animate={{ backgroundColor: "#00acee" }}
      >
        <section>
          <div>
            Gönderi Sayısı:
            <p className="metric">{data?.length ? data.length : 0}</p>
          </div>
          <div>
            Toplam Etkileşim:
            <p className="metric">{getSum(publicMetricSums)}</p>
          </div>
        </section>
        <section>
          <div>
            <AiOutlineHeart />
            <p className="metric">{publicMetricSums["like_count"]}</p>
          </div>
          <div>
            <FaRegComment />
            <p className="metric">{publicMetricSums["reply_count"]}</p>
          </div>
          <div>
            <AiOutlineRetweet />
            <p className="metric">{publicMetricSums["retweet_count"]}</p>
          </div>
        </section>
      </motion.div>
      {!data?.length ? (
        <div className="no-data">{isSearching ? "Aranıyor" : "Veri Yok"}</div>
      ) : (
        <>
          {
            <motion.div
              className="share-container"
              whileHover="hover"
              variants={hoverVariants}
              transition={{ duration: 0.2 }}
            >
              <div className="share">
                <div className="title">En çok etkileşim alan paylaşım</div>
                <a
                  href={`https://twitter.com/${username}/status/${data[popular].id}`}
                  target="_blank"
                >
                  <p className="content">{data[popular].text}</p>
                </a>
                <div className="meta-data">
                  <div className="metrics">
                    <p className="metric">
                      <AiOutlineHeart />{" "}
                      {data[popular].public_metrics["like_count"]}
                    </p>
                    <p className="metric">
                      <FaRegComment />{" "}
                      {data[popular].public_metrics["reply_count"]}
                    </p>
                    <p className="metric">
                      <AiOutlineRetweet />
                      {data[popular].public_metrics["retweet_count"]}
                    </p>
                  </div>
                  <p className="share-date">
                    {new Date(data[popular].created_at).toLocaleTimeString() +
                      " - " +
                      new Date(data[popular].created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </motion.div>
          }
          {data?.map((tweet, index) => {
            return (
              <motion.div
                className="share-container"
                key={tweet.id}
                whileHover="hover"
                variants={hoverVariants}
                transition={{ duration: 0.2 }}
              >
                <div className="share-index">
                  <p>{index + 1}</p>
                </div>
                <div className="share">
                  <a
                    href={`https://twitter.com/${username}/status/${tweet.id}`}
                    target="_blank"
                  >
                    <p className="content">{tweet.text}</p>
                  </a>
                  <div className="meta-data">
                    <div className="metrics">
                      <p className="metric">
                        <AiOutlineHeart /> {tweet.public_metrics["like_count"]}
                      </p>
                      <p className="metric">
                        <FaRegComment /> {tweet.public_metrics["reply_count"]}
                      </p>
                      <p className="metric">
                        <AiOutlineRetweet />
                        {tweet.public_metrics["retweet_count"]}
                      </p>
                    </div>
                    <p className="share-date">
                      {new Date(tweet.created_at).toLocaleTimeString() +
                        " - " +
                        new Date(tweet.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default Twitter;
