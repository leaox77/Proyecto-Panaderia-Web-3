import { useState, useEffect } from 'react';
import axios from "axios";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={<Login/>}
        />
        <Route
          path='/dashboard'
          element={<Dashboard/>}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
