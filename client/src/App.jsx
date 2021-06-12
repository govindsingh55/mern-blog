import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router } from "react-router-dom";
import Routes from './Router';

function App() {
  return (
    <Router>
      <Routes />
    </Router>
  )
}

export default App
