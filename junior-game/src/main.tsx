import React from 'react';
import { createRoot } from 'react-dom/client';
import { JuniorApp } from './JuniorApp';
import './juniorStyles.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <JuniorApp />
  </React.StrictMode>
);
