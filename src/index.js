import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';  // Make sure the extension is correct

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
