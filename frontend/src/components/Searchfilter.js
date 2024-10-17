// components/SearchFilter.js

import React from 'react';

const SearchFilter = ({ setSearchQuery }) => {
  return (
    <div className="flex flex-wrap justify-between p-4">
      <div className="flex items-center">
        <label className="mr-2">Search:</label>
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none"
          onChange={(e) => setSearchQuery(e.target.value)} // Update the search query on input change
        />
      </div>
      <div>
        <label className="mr-2">Sort By:</label>
        <select className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none">
          <option>Recent</option>
          <option>Oldest</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilter;
