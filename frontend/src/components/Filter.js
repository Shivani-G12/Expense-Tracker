import React from "react";

function Filter({ selectedDate, setSelectedDate }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <label>Filter by Date: </label>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
    </div>
  );
}

export default Filter;

