import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import App from './App';
import ScrollToTop from './components/ScrollToTop';
import { EMAILJS } from './constants';
import './index.css';

emailjs.init(EMAILJS.PUBLIC_KEY);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

