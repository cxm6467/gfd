import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// TODO: Add Apollo Provider setup
// TODO: Add Auth0 Provider setup  
// TODO: Add global error boundary
// TODO: Add performance monitoring setup

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);