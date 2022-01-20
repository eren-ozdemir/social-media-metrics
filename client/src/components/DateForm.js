import { useState, useEffect } from "react";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";

const DateForm = ({ setStartDate, setEndDate }) => {
  const [value, setDateRange] = useState([new Date(), new Date()]);

  useEffect(() => {
    if (value) {
      setStartDate(value[0]);
      setEndDate(value[1]);
    }
  }, [value]);

  return (
    <div className="date-input">
      <DateTimeRangePicker onChange={setDateRange} value={value} />
    </div>
  );
};

export default DateForm;
