import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TableDatePicker = ({ onSelectedDateChange }) => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(null);
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    onSelectedDateChange(start, end);
  };

  return (
    <DatePicker
      dateFormat="MM/dd/yy"
      selected={startDate}
      onChange={onChange}
      startDate={startDate}
      endDate={endDate}
      selectsRange
      // placeholderText="Click Me"
      filterDate={(date) => {
        return new Date() > date;
      }}
    />
  );
};

export default TableDatePicker;
