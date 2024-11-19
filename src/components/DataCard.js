import React from "react";

const DataCard = ({ title, data }) => {
  return (
    <div className="border rounded-lg shadow-md p-4 bg-white">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <ul className="text-sm">
        {Object.entries(data).map(([key, value]) => (
          <li key={key}>
            <span className="font-semibold capitalize">{key}: </span>
            {value || "N/A"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DataCard;
