import React from "react";
import { useState, useEffect, useRef } from "react";
import { AiOutlineRetweet, AiOutlineHeart } from "react-icons/ai";
import { FaArrowLeft, FaRegComment } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

const Twitter = ({ data, setIsDetailsVisible, username }) => {
  const [popular, setPopular] = useState();
  const [publicMetricSums, setPublicMetricSums] = useState({
    like_count: 0,
    retweet_count: 0,
    comment_count: 0,
  });
  const hoverVariants = {
    hover: { backgroundColor: "#02678f" },
  };

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
      findPopular(data);
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

  const getSum = (arr) => {
    let total = 0;
    for (let item in arr) {
      total += arr[item];
    }
    return total;
  };

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div className="social-media-item" transition={{ type: "tween" }}>
        <div className="header-container">
          <div className="header">
            <FaArrowLeft
              className="back-arrow"
              onClick={() => setIsDetailsVisible(false)}
            />
            <h2 className="detail-header">{username}</h2>
          </div>

          <div className="metrics sums">
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
          </div>
        </div>

        <div className="share-container">
          {popular && (
            <motion.div
              className="share-wrapper"
              whileHover="hover"
              variants={hoverVariants}
              transition={{ duration: 0.2 }}
            >
              <div className="share">
                <h3 className="title">En çok etkileşim alan paylaşım</h3>

                <p className="content">{data[popular].text}</p>

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
                      <AiOutlineRetweet />{" "}
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
          )}
          {data?.map((tweet, index) => {
            return (
              <motion.div
                className="share-wrapper"
                key={tweet.id}
                whileHover="hover"
                variants={hoverVariants}
                transition={{ duration: 0.2 }}
              >
                <div className="share-index">
                  <p>{index + 1}</p>
                </div>
                <div className="share">
                  {/* <a
                    href={`https://twitter.com/${username}/status/${tweet.id}`}
                    target="_blank"
                  > */}
                  <p className="content">{tweet.text}</p>
                  {/* </a> */}
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
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Twitter;
