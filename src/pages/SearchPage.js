import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchPage.css';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/results?q=${query}`);
  };

  return (
    <div className="search-page-container">
      <h1>Search YouTube Video</h1>
      <h2>And you will be able to play it as an audio in a player</h2>
      <h2>Even with closed telegram or locked phone!</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search.."
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchPage;
