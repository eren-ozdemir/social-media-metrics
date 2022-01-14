import { useRef, useState, useEffect } from "react";
import DateForm from "./DateForm";
import Options from "./Options";
import Nav from "./Nav";
import useLocalStorage from "../hooks/useLocalStorage";
import axios from "axios";

const SearchInput = ({
  socialMedia,
  setSocialMedia,
  setTwitterData,
  setYouTubeData,
  handleResponse,
  isSearching,
  setIsSearching,
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

  const searchTwitter = async () => {
    setIsSearching(true);
    try {
      const res = await axios.get("/twitter/public", {
        params: {
          username: usernameRef.current.value,
          start_time: startDate,
          end_time: endDate,
        },
      });
      setTwitterData(res.data.data);
      setIsSearching(false);
    } catch (err) {
      console.log(err);
      setIsSearching(false);
    }
  };

  const searchYouTube = async () => {
    setIsSearching(true);
    try {
      const res = await axios.get("/youtube/public", {
        params: {
          channelName: usernameRef.current.value,
          start_time: startDate,
          end_time: endDate,
        },
      });
      setYouTubeData(res.data);
      setIsSearching(false);
    } catch (err) {
      console.log(err);
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    if (socialMedia === "twitter") searchTwitter();
    if (socialMedia === "youTube") searchYouTube();
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
        <div className="btn" onClick={handleSearch}>
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
  );
};

export default SearchInput;
