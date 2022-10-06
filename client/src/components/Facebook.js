import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Options from "./Options";
import { AiOutlineRetweet, AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";

const Facebook = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  optionList,
  setOptionList,
}) => {
  const [publicMetricSums, setPublicMetricSums] = useState([]);
  const facebookUsernameRef = useRef();
  const [facebookData, setFacebookData] = useState();
  const [facebookDataFiltered, setFacebookDataFiltered] = useState();
  const [data, setData] = useState();

  useEffect(() => {
    if (startDate) filterByDate();
  }, [startDate, endDate]);

  useEffect(() => {
    setData(facebookDataFiltered ? facebookDataFiltered : facebookData);
  }, [data, facebookData, facebookDataFiltered]);

  const searchFacebook = async () => {
    try {
      const res = await axios.get("http://localhost:3001/facebook/public", {
        params: {
          username: facebookUsernameRef.current.value,
          start_time: startDate,
          end_time: endDate,
        },
      });
      setFacebookData(res.data);
      const start = res.data[res.data.length - 1].created_at;
      setStartDate(new Date(start));
    } catch (err) {
      console.log(err);
    }
  };

  const filterByDate = () => {
    const tempFacebookDataFiltered = facebookData?.filter((share) => {
      const shareDate = new Date(share.created_at);
      return shareDate >= startDate && shareDate <= endDate;
    });
    tempFacebookDataFiltered &&
      setFacebookDataFiltered([...tempFacebookDataFiltered]);
  };

  const setInput = (_selected) => {
    facebookUsernameRef.current.value = _selected;
  };

  const addOption = () => {
    if (!optionList.includes(facebookUsernameRef.current?.value)) {
      setOptionList([...optionList, facebookUsernameRef.current?.value]);
    }
  };

  const removeOption = () => {
    if (optionList.includes(facebookUsernameRef.current?.value)) {
      const arr = optionList.filter(
        (option) => option !== facebookUsernameRef.current?.value
      );
      setOptionList([...arr]);
    }
  };

  const convertDate = (_date) => {
    const day = _date.getDay();
    return;
  };

  useEffect(() => {
    if (data) {
      const tempPublicMetricSums = new Object();
      for (const metric in data[0]?.public_metrics) {
        tempPublicMetricSums[metric] = 0;
      }

      data.map((share) => {
        for (const metric in share?.public_metrics) {
          tempPublicMetricSums[metric] += share?.public_metrics[metric];
        }
      });
      setPublicMetricSums(tempPublicMetricSums);
    }
  }, [data]);

  return (
    <div className="social-media-item">
      <div className="search-box-container">
        <p>Facebook User Name</p>
        <input type="input" ref={facebookUsernameRef} />
        <Options setInput={setInput} optionList={optionList} />
        <div className="buttons">
          <button className="btn" onClick={searchFacebook}>
            Facebook'da Ara
          </button>
          <button className="btn" onClick={addOption}>
            Ekle
          </button>
          <button className="btn" onClick={removeOption}>
            Sil
          </button>
        </div>
      </div>
      <div className="metrics sums">
        <p className="metric">Gönderi Sayısı: {data?.length}</p>
        <p className="metric">
          {/* <AiOutlineHeart /> {publicMetricSums["like_count"]} */}
        </p>
        <p className="metric">
          {/* <FaRegComment /> {publicMetricSums["reply_count"]} */}
        </p>
        <p className="metric">
          {/* <AiOutlineRetweet /> {publicMetricSums["retweet_count"]} */}
        </p>
      </div>
      <div className="dates">
        <p>
          En Eski Gönderi
          <br />
          {new Date(startDate).toDateString()}
        </p>
        <p>
          En Yeni Gönderi
          <br />
          {new Date(endDate).toDateString()}
        </p>
      </div>

      {!data?.length ? (
        <div className="no-data">Veri yok</div>
      ) : (
        data?.map((share, index) => {
          return (
            <>
              <div className="share-container">
                <div className="share-index">
                  <p>{index + 1}</p>
                </div>
                <div className="share">
                  {/* <p className="content">{share.text}</p> */}
                  <div className="meta-data">
                    <div className="metrics">
                      <p className="metric">
                        {/* <AiOutlineHeart /> {share.public_metrics["like_count"]} */}
                      </p>
                      <p className="metric">
                        {/* <FaRegComment /> {share.public_metrics["reply_count"]} */}
                      </p>
                      <p className="metric">
                        <AiOutlineRetweet />
                        {/* {share.public_metrics["retweet_count"]} */}
                      </p>
                    </div>
                    <p className="share-date">
                      {/* {new Date(tweet.created_at).toLocaleDateString()} */}
                    </p>
                  </div>
                </div>
              </div>
            </>
          );
        })
      )}
    </div>
  );
};

export default Facebook;
