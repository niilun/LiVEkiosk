import React, { useState, useEffect } from 'react';
import axios from 'axios';
import queryString from 'query-string'
import './LiVEkiosk.css';

// the delay (in miliseconds), for query the backend
const checkCooldown = 30000;

function LiVEkiosk() {
  const [isLive, setIsLive] = useState(false);
  const [isCheckCompleted, setIsCheckCompleted] = useState(false);
  const [message, setMessage] = useState('');
  const [messageMin, setMessageMin] = useState('');
  const [scheduledStartTime, setScheduledStartTime] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [nextCheckCountdown, setNextCheckCountdown] = useState(30);
  const queryIdParam = queryString.parse(window.location.search).id;

  const checkLiveStatus = async () => { 
    try {
      // if id isn't provided, show error
      if (!queryIdParam) {
        console.log('ID not provided in request! End your URL with ?id=some_video_id.')
        setMessage('VIDEO ID MISSING')
        setMessageMin('')
        return
      }

      // initiate request
      setMessage('CHECKING STATUS');
      const video_request = await axios.get(`http://localhost:5000/youtube_info?id=${queryIdParam}`);
      
      // if it's reported as a video or live, load it
      if (video_request.data.is_live || video_request.data.is_video) {
        console.log('Stream found! Loading embed...')
        setMessage('FOUND')
        setMessageMin('LOADING...');
        await new Promise(video_request_solve => setTimeout(video_request_solve, 2000));

        setIsLive(true);
      } else {
        // if it's a scheduled video, set the start time and notify user (set only once)
        console.log(`Stream is scheduled, re-checking in ${checkCooldown / 1000}s`)
        setMessage('STREAM SCHEDULED');
        setMessageMin('CHECKING AGAIN IN');

        if (!scheduledStartTime) {
          setScheduledStartTime((prev) => prev || video_request.data.scheduled_start_time);
        }
      }
      // so the countdown doesn't show before it's actually checked
      setIsCheckCompleted(true);
    } catch (error) {
      setMessage('ERROR')
      setMessageMin(error.message || 'An error occurred')
      console.error(`Failed to fetch live status: ${error}, check if backend is active!`);
    }
  };

  // run checkLiveStatus() every 30s
  useEffect(() => {
    checkLiveStatus();
    const interval = setInterval(() => {
      checkLiveStatus();
      setNextCheckCountdown(30);
    }, checkCooldown);
    return () => clearInterval(interval);
  }, []);

  // updates the cooldown to be shown on screen
  useEffect(() => {
    const interval = setInterval(() => {
      setNextCheckCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scheduledStartTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const startDate = new Date(scheduledStartTime * 1000);
        const timeRemaining = startDate - now;

        if (timeRemaining <= 0) {
          clearInterval(interval);
          setCountdown('Live now!');
        } else {
          const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
          const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
          setCountdown(`${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [scheduledStartTime]);

  return (
    <div className="App">
      <div className="watermark"><img src="/watermark.png" alt="watermark" /></div>
      {isLive ? (
        <iframe
          className="fullscreen-iframe"
          src={`https://www.youtube.com/embed/${queryIdParam}?autoplay=1`}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          title="YouTube embed"
        />
      ) : (
        <div className="waiting-screen">
          <h1>{message}</h1>
          {scheduledStartTime && (
            <div>
              <p>STARTING IN: {countdown}</p>
            </div>
          )}
          <p>{messageMin}{isCheckCompleted ? ` ${nextCheckCountdown}s` : ''}</p>
        </div>
      )}
    </div>
  );
}

export default LiVEkiosk;