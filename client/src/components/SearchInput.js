import { useRef, useState, useEffect } from "react";
import DateForm from "./DateForm";
import Options from "./Options";
import Nav from "./Nav";
import useLocalStorage from "../hooks/useLocalStorage";
import axios from "axios";
import { FaCross, FaWindowClose } from "react-icons/fa";
import { AiFillCloseCircle, AiOutlineClose } from "react-icons/ai";

const SearchInput = ({
  socialMedia,
  setSocialMedia,
  twitterDatas,
  youTubeDatas,
  setTwitterData,
  setTwitterDatas,
  setYouTubeData,
  setYouTubeDatas,
  handleResponse,
  isSearching,
  setIsSearching,
  isMultiple,
}) => {
  const [startDate, setStartDate] = useState(new Date(2021, 6, 1));
  const [endDate, setEndDate] = useState(new Date(Date.now()));
  const usernameRef = useRef();
  const [username, setUsername] = useState();
  const [optionList, setOptionList] = useState([]);
  const [twitterOptionList, setTwitterOptionList] = useLocalStorage(
    "twitter-option-list"
  );
  const [youTubeOptionList, setYouTubeOptionList] = useLocalStorage(
    "youTube-option-list"
  );
  const [queryList, setQueryList] = useState(["Yatırım Finansman"]);

  let tempResults = [];

  useEffect(() => {
    twitterOptionList && setOptionList([...twitterOptionList]);
  }, []);

  const setInput = (_selected) => {
    usernameRef.current.value = _selected;
  };

  const addOption = () => {
    if (!optionList?.includes(usernameRef.current?.value)) {
      setOptionList([...optionList, usernameRef.current?.value]);
    }
  };

  const removeOption = () => {
    if (optionList.includes(usernameRef.current?.value)) {
      const arr = optionList.filter(
        (option) => option !== usernameRef.current?.value
      );
      setOptionList([...arr]);
    }
  };

  const handleSocialMediaSelection = (_new) => {
    setSocialMedia((prev) => {
      if (prev === "twitter" && optionList)
        setTwitterOptionList([...optionList]);
      if (prev === "youTube" && optionList)
        setYouTubeOptionList([...optionList]);
      if (_new === "twitter" && twitterOptionList)
        setOptionList([...twitterOptionList]);
      if (_new === "youTube" && youTubeOptionList)
        setOptionList([...youTubeOptionList]);
      return _new;
    });
  };

  const handleSearch = async () => {
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
    )
      setQueryList([...queryList, usernameRef.current.value]);
  };

  const removeQuery = (_query) => {
    if (queryList.includes(_query))
      setQueryList(queryList.filter((q) => q !== _query));
  };

  return (
    <div className="search-box-container">
      <DateForm setStartDate={setStartDate} setEndDate={setEndDate} />
      <Nav
        socialMedia={socialMedia}
        handleSocialMediaSelection={handleSocialMediaSelection}
      />
      <div className="search-input">
        <input type="input" ref={usernameRef} placeholder="Kullanıcı Adı" />
        <div className="btn" onClick={() => handleSearch()}>
          <div className="underline"></div>
          Ara
        </div>
        <div className="btn" onClick={addQuery}>
          <div className="underline"></div>
          Sıraya Ekle
        </div>
      </div>

      {isMultiple ? (
        <div className="query-list-container">
          {queryList?.map((_query) => {
            return (
              <div className="query-item" key={_query}>
                <p>{_query}</p>
                <FaWindowClose
                  className="pointer"
                  onClick={() => removeQuery(_query)}
                />
              </div>
            );
          })}
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default SearchInput;
