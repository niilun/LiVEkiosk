import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import LiVEkiosk from './LiVEkiosk';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <LiVEkiosk />
);

const reportVitals = (message) => {
    console.log('WebVitals report: ', message);
}

reportWebVitals(reportVitals);
