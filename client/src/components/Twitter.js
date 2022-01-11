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
  const twitterUsernameRef = useRef();
  const [twitterData, setTwitterData] = useState();
  const [twitterDataFiltered, setTwitterDataFiltered] = useState();

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

  const searchTwitter = async () => {
    setIsSearching(true);
    setData([]);
    try {
      const res = await axios.get("/twitter/public", {
        params: {
          username: twitterUsernameRef.current.value,
          start_time: startDate,
          end_time: endDate,
        },
      });
      setTwitterData(res.data);
      const start = res.data[res.data.length - 1].created_at;
      setStartDate(new Date(start));
      setIsSearching(false);
      findPopular(res.data);
    } catch (err) {
      console.log(err);
      setIsSearching(false);
    }
  };

  const filterByDate = () => {
    const tempTwitterDataFiltered = twitterData?.filter((tweet) => {
      const tweetDate = new Date(tweet.created_at);
      return tweetDate >= startDate && tweetDate <= endDate;
    });
    tempTwitterDataFiltered &&
      setTwitterDataFiltered([...tempTwitterDataFiltered]);
  };

  const setInput = (_selected) => {
    twitterUsernameRef.current.value = _selected;
  };

  const addOption = () => {
    if (!optionList.includes(twitterUsernameRef.current?.value)) {
      setOptionList([...optionList, twitterUsernameRef.current?.value]);
    }
  };

  const removeOption = () => {
    if (optionList.includes(twitterUsernameRef.current?.value)) {
      const arr = optionList.filter(
        (option) => option !== twitterUsernameRef.current?.value
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
    <div className="social-media-item">
      <div className="search-box-container">
        <div className="search-input">
          <input
            type="input"
            ref={twitterUsernameRef}
            placeholder="Kullanıcı Adı"
          />
          <div className="btn" onClick={searchTwitter}>
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
      <motion.div
        className="metrics sums"
        initial={{ backgroundColor: "#990303" }}
        animate={{ backgroundColor: "#00acee" }}
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
          <p className="metric">{publicMetricSums["like_count"]}</p>
        </div>
        <div>
          <FaRegComment />
          <p className="metric">{publicMetricSums["comment_count"]}</p>
        </div>
        <div>
          <AiOutlineRetweet />
          <p className="metric">{publicMetricSums["retweet_count"]}</p>
        </div>
      </motion.div>
      {!data?.length ? (
        <div className="no-data">{isSearching ? "Aranıyor" : "Veri Yok"}</div>
      ) : (
        <div>
          {
            <div className="share-container">
              <div className="share">
                <div className="title">En çok etkileşim alan paylaşım</div>
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
            </div>
          }
          {data?.map((tweet, index) => {
            return (
              <div className="share-container" key={tweet.id}>
                <div className="share-index">
                  <p>{index + 1}</p>
                </div>
                <div className="share">
                  <p className="content">{tweet.text}</p>
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Twitter;
