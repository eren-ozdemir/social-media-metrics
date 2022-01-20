import { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineHeart } from "react-icons/ai";
import { FaArrowLeft, FaRegComment } from "react-icons/fa";
import { motion } from "framer-motion";
import { IconContext } from "react-icons";

const YouTube = ({ data, setIsDetailsVisible, channelName }) => {
  const [popular, setPopular] = useState();
  const [publicMetricSums, setPublicMetricSums] = useState({
    likeCount: 0,
    viewCount: 0,
    commentCount: 0,
  });
  const hoverVariants = {
    hover: { backgroundColor: "#750000" },
  };

  //Get sum of metrics
  useEffect(() => {
    if (data) {
      const tempPublicMetricSums = new Object();
      for (const metric in data[0]?.statistics) {
        tempPublicMetricSums[metric] = 0;
      }

      data?.map((share) => {
        for (const metric in share.statistics) {
          tempPublicMetricSums[metric] += Number(share.statistics[metric]);
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
      for (const metric in share?.statistics) {
        if (metric !== "favoriteCount") sum += Number(share.statistics[metric]);
      }
      share.statistics.sum = sum;
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
    <IconContext.Provider
      value={{ color: "white", className: "icon", fontWeight: "bold" }}
    >
      <>
        <motion.div
          className="social-media-item"
          transition={{ type: "tween" }}
        >
          <div className="header-container">
            <div className="header">
              <FaArrowLeft
                className="back-arrow"
                onClick={() => setIsDetailsVisible(false)}
              />
              <h2 className="detail-header">{channelName}</h2>
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
                  <a
                    href={`http://www.youtube.com/watch?v=${data[popular].id}`}
                    target="_blank"
                  >
                    <div className="youtube-content">
                      <img
                        className="thumbnail"
                        src={data[popular].snippet.thumbnails.medium.url}
                      />
                      <div>
                        <p className="title">{data[popular].snippet.title}</p>
                        <br />
                        <p className="title">
                          {data[popular].snippet.channelTitle}
                        </p>
                      </div>
                    </div>
                  </a>
                  <div className="meta-data">
                    <div className="metrics">
                      <div>
                        <AiOutlineHeart />
                        <p className="metric">
                          {data[popular].statistics["likeCount"]}
                        </p>
                      </div>
                      <div>
                        <FaRegComment />
                        <p className="metric">
                          {data[popular].statistics["commentCount"]}
                        </p>
                      </div>
                      <div>
                        <AiOutlineEye />
                        <p className="metric">
                          {data[popular].statistics["viewCount"]}
                        </p>
                      </div>
                    </div>
                    <p className="share-date">
                      {new Date(
                        data[popular].snippet.publishedAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            {data?.map((share, index) => {
              return (
                <motion.div
                  className="share-wrapper"
                  key={share.id}
                  whileHover="hover"
                  variants={hoverVariants}
                  transition={{ duration: 0.2 }}
                >
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
                          <AiOutlineEye className="icon" />
                          <p className="metric">
                            {share.statistics["viewCount"]}
                          </p>
                        </div>
                      </div>
                      <p className="share-date">
                        {new Date(
                          share.snippet.publishedAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </>
    </IconContext.Provider>
  );
};

export default YouTube;
