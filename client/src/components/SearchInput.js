import { useRef, useState, useEffect } from "react";
import { FaWindowClose } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import Nav from "./Nav";
import DateForm from "./DateForm";

const SearchInput = ({
  socialMedia,
  setSocialMedia,
  setTwitterDatas,
  setYouTubeDatas,
  setIsSearching,
  queryList,
  setQueryList,
}) => {
  const [startDate, setStartDate] = useState(new Date(2021, 6, 1));
  const [endDate, setEndDate] = useState(new Date(Date.now()));
  const usernameRef = useRef();
  const [optionList, setOptionList] = useState([]);

  let tempResults = [];

  const handleSearch = async () => {
    if (startDate - endDate === 0) {
      alert("Bir tarih aralığı seçin.");
      return;
    }
    if (!queryList.length) {
      alert("En az bir kullanıcı adı ekleyin.");
      return;
    }

    setIsSearching(true);
    if (socialMedia === "twitter") {
      tempResults = [];
      for (let item of queryList) {
        tempResults.push(await searchTwitter(item));
      }
      setTwitterDatas([...tempResults]);
    }
    if (socialMedia === "youTube") {
      tempResults = [];
      for (let item of queryList) {
        tempResults.push(await searchYouTube(item));
      }
      setYouTubeDatas([...tempResults]);
    }
    setIsSearching(false);
  };

  const searchTwitter = async (_username) => {
    setIsSearching(true);
    try {
      const res = await axios.get("/twitter/public", {
        params: {
          username: _username,
          start_time: startDate,
          end_time: endDate,
        },
      });
      setIsSearching(false);
      return res.data;
    } catch (err) {
      console.log(err);
      setIsSearching(false);
    }
  };

  const searchYouTube = async (_username) => {
    setIsSearching(true);
    try {
      const res = await axios.get("/youtube/public", {
        params: {
          channelName: _username,
          start_time: startDate,
          end_time: endDate,
        },
      });

      setIsSearching(false);
      return res.data;
    } catch (err) {
      console.log(err);
      setIsSearching(false);
    }
  };

  const addQuery = () => {
    if (
      usernameRef.current.value &&
      !queryList?.includes(usernameRef.current.value)
    ) {
      if (queryList.length === 12) {
        alert("Tek seferde en fazla 12 arama yapabilirsiniz.");
        return;
      }
      setQueryList([...queryList, usernameRef.current.value]);
      usernameRef.current.value = "";
    }
  };

  const removeQuery = (_query) => {
    if (queryList.includes(_query))
      setQueryList(queryList.filter((q) => q !== _query));
  };

  const resetDatas = () => {
    setYouTubeDatas([]);
    setTwitterDatas([]);
    setQueryList([]);
  };

  const handleEnterKeyDown = (e) => {
    if (e.key === "Enter") addQuery();
  };

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        className="search-box-container"
        layout
        transition={{ type: "tween" }}
      >
        <Nav socialMedia={socialMedia} setSocialMedia={setSocialMedia} />
        <DateForm setStartDate={setStartDate} setEndDate={setEndDate} />
        <div className="search-input">
          <input
            type="input"
            ref={usernameRef}
            onKeyDown={(e) => handleEnterKeyDown(e)}
            placeholder="Kullanıcı Adı"
          />

          <div className="btn" onClick={addQuery}>
            <div className="underline"></div>
            Sıraya Ekle
          </div>
          <div className="btn" onClick={handleSearch}>
            <div className="underline"></div>
            Ara
          </div>
          <div className="btn" onClick={resetDatas}>
            <div className="underline"></div>
            Temizle
          </div>
        </div>
        <div className="query-list-container">
          <div className="query-list-wrapper">
            {queryList?.map((_query) => {
              return (
                <div
                  className="query-item pointer"
                  key={_query}
                  onClick={() => removeQuery(_query)}
                >
                  <p>{_query}</p>
                  <FaWindowClose className="pointer" />
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchInput;
