import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import App from './App';
import { LoginContextProvider } from './context/LoginContext';
import {BrowserRouter} from "react-router-dom";

const root = document.getElementById('app-root');

const appRoot = createRoot(root);

appRoot.render(
  <React.StrictMode>
    <LoginContextProvider>
        <BrowserRouter>
      <App />
        </BrowserRouter>
    </LoginContextProvider>
  </React.StrictMode>
);
