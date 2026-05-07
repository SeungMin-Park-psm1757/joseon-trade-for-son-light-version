import React from 'react';
import { createRoot } from 'react-dom/client';
import { JuniorApp } from './JuniorApp';
import './juniorStyles.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <JuniorApp />
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}service-worker.js`)
      .catch(() => {
        // The game still works online if service worker registration is blocked.
      });
  });
}
