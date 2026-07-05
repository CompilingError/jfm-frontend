import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router';

import App from './renderer/App.jsx';
import './index.css';

const rootElement = document.getElementById('root');

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);