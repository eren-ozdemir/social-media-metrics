import React from "react";
import { useRef } from "react";

const DateForm = ({ setStartDate, setEndDate }) => {
  const startDateRef = useRef();
  const endDateRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const resetDates = (e) => {
    e.preventDefault();
    setStartDate(new Date());
    setEndDate(Date.now());
  };

  return (
    <form className="date-input-form">
      <div className="date-input-container">
        <div className="date-input">
          <p>Başlangıç Tarihi</p>
          <input
            type="datetime-local"
            ref={startDateRef}
            onChange={() => setStartDate(new Date(startDateRef.current.value))}
          />
        </div>
        <div className="date-input">
          <p>Bitiş Tarihi</p>
          <input
            type="datetime-local"
            ref={endDateRef}
            onChange={() => setEndDate(new Date(endDateRef.current.value))}
          />
        </div>
      </div>
    </form>
  );
};

export default DateForm;
