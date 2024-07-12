import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ResultsPage.css';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const ResultsPage = () => {
  const query = useQuery().get('q');
  const [results, setResults] = useState([]);
  const [nextPageToken, setNextPageToken] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchResults = async (pageToken = '') => {
    setLoading(true);
    const options = {
      method: 'GET',
      url: 'https://youtube-v2.p.rapidapi.com/search',
      params: { 
        query: query,
        type: 'video',
        lang: 'en',
        order_by: 'this_month',
        country: 'us',
        PAGINATION_TOKEN: pageToken // Adding the pageToken parameter
      },
      headers: {
        'x-rapidapi-key': '4c8bed4972msh092430a49c00028p19dc7fjsn92f1d89f648d',
        'x-rapidapi-host': 'yt-api.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      const temp = response.data.data;
      const responseData = Array.isArray(temp) ? temp.filter(result => result.title.toLowerCase() !== "shorts") : [];

      setResults(prevResults => [...prevResults, ...responseData]);
      setNextPageToken(response.data.continuation);
      setLoading(false);
  
    } catch (error) {
      console.error('Error fetching search results', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      setResults([]); // Reset results on new query
      fetchResults();
    }
  }, [query]);

  const handlePlayAudio = (videoId) => {
    navigate(`/player?videoUrl=https://www.youtube.com/watch?v=${videoId}`);
  };

  return (
    <div className="search-results-container">
      <div className="search-results">
        {results.map((result) => (
          <div key={result.videoId} className="result-card">
            <a href={`https://www.youtube.com/watch?v=${result.videoId}`} target="_blank" rel="noopener noreferrer">
              <h2>{result.title}</h2>
            </a>
            <p>{result.channelTitle}</p>
            <p>{result.description}</p>
            <p>{result.viewCount} views</p>
            <p>{result.publishedTimeText}</p>
            {result.thumbnail && result.thumbnail.length > 0 && (
              <a href={`https://www.youtube.com/watch?v=${result.videoId}`} target="_blank" rel="noopener noreferrer">
                <img src={result.thumbnail[0].url} alt={result.title} />
              </a>
            )}
            <button onClick={() => handlePlayAudio(result.videoId)}>Play Audio</button>
          </div>
        ))}
      </div>
      {nextPageToken && (
        <button className="next-page-button" onClick={() => fetchResults(nextPageToken)} disabled={loading}>
          {loading ? 'Loading...' : 'Next Page'}
        </button>
      )}
    </div>
  );
};

export default ResultsPage;
