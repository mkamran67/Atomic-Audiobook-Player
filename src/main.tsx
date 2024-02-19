import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './renderer/src/App';

// import './renderer/index.css'


const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
