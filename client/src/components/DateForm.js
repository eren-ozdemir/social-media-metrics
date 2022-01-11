import { useState, useEffect, useRef } from "react";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";

const DateForm = ({ setStartDate, setEndDate }) => {
  const startDateRef = useRef();
  const endDateRef = useRef();
  const [value, setDateRange] = useState([new Date(), new Date()]);

  useEffect(() => {
    if (value) {
      setStartDate(value[0]);
      setEndDate(value[1]);
    }
  }, [value]);

  const resetDates = (e) => {
    e.preventDefault();
    setStartDate(new Date());
    setEndDate(Date.now());
  };

  return (
    <div className="date-input">
      <p>Tarih Aralığı</p>
      <DateTimeRangePicker onChange={setDateRange} value={value} />
    </div>
  );
};

export default DateForm;
