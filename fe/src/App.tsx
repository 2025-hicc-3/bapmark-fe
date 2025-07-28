import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MapPage from './pages/MapPage';
import MapTestPage from './pages/MapTestPage';
import BoardPage from './pages/BoardPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MapPage />} />
        <Route path='/map' element={<MapPage />} />
        <Route path='/board' element={<BoardPage />} />
        <Route path='/maptest' element={<MapTestPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
