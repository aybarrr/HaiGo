import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './PlayerPage.css';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const PlayerPage = () => {
  const videoUrl = useQuery().get('videoUrl');
  const [audioLink, setAudioLink] = useState('');

  useEffect(() => {
    const fetchAudioLink = async () => {
      const videoId = `https://www.youtu.be/${videoUrl}`;
      const options = {
        method: 'GET',
        url: 'https://youtube-mp3-downloader2.p.rapidapi.com/ytmp3/ytmp3/custom/',
        params: {
          url: `${videoId}`,
          quality: '320'
        },
        headers: {
          'x-rapidapi-key': '4c8bed4972msh092430a49c00028p19dc7fjsn92f1d89f648d',
          'x-rapidapi-host': 'youtube-mp3-downloader2.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        const downloadLink = response.data.dlink;
        setAudioLink(downloadLink);
      } catch (error) {
        console.error('Error fetching audio link', error);
      }
    };

    if (videoUrl) {
      fetchAudioLink();
    }
  }, [videoUrl]);

  return (
    <div className="player-container">
      <h1>Audio Player</h1>
      {audioLink ? (       
        <>
        <p>Playing audio from: {videoUrl}</p>
        <h2>You can keep listening to this audio even with closed telegram or locked phone. Enjoy!</h2>
        <audio controls>
          <source src={audioLink} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PlayerPage;
