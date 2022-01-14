import { useState, useEffect } from "react";
import DateForm from "./DateForm";
import useLocalStorage from "../hooks/useLocalStorage";
import { motion, AnimatePresence } from "framer-motion";

const Table = () => {
  const [startDate, setStartDate] = useState(new Date(2021, 6, 1));
  const [endDate, setEndDate] = useState(new Date(Date.now()));
  const [twitterOptionList, setTwitterOptionList] = useLocalStorage(
    "twitter-option-list"
  );
  const [youTubeOptionList, setYouTubeOptionList] = useLocalStorage(
    "youTube-option-list"
  );
  return <div className="container"></div>;
};

export default Table;
