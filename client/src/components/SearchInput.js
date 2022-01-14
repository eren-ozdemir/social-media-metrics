import { useRef, useState, useEffect } from "react";
import DateForm from "./DateForm";
import Options from "./Options";
import Nav from "./Nav";
import useLocalStorage from "../hooks/useLocalStorage";

const SearchInput = ({
  setTwitterData,
  setStartDate,
  setEndDate,
  handleResponse,
}) => {
  const [socialMedia, setSocialMedia] = useState("twitter");
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
    setOptionList([...twitterOptionList]);
  }, []);

  useEffect(() => {}, [socialMedia]);

  const searchTwitter = async () => {
    setIsSearching(true);
    setData([]);
    try {
      const res = await axios.get("/twitter/public", {
        params: {
          username: username.current.value,
          start_time: startDate,
          end_time: endDate,
        },
      });
      setUsername(username.current.value);
      setTwitterData(res.data.data);
      const start = res.data.data[res.data.data.length - 1].created_at;
      setStartDate(new Date(start));
      setIsSearching(false);
      findPopular(res.data.data);
    } catch (err) {
      console.log(err);
      setIsSearching(false);
    }
  };

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
      if (prev === "twitter") setTwitterOptionList([...optionList]);
      if (prev === "youTube") setYouTubeOptionList([...optionList]);
      if (_new === "twitter") setOptionList([...twitterOptionList]);
      if (_new === "youTube") setOptionList([...youTubeOptionList]);
      return _new;
    });
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
  );
};

export default SearchInput;
