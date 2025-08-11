import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import { StampProvider } from './store/StampContext';
import MapPage from './pages/MapPage';
import MapTestPage from './pages/MapTestPage';
import BoardPage from './pages/BoardPage';
import BoardDetailPage from './pages/BoardDetailPage';

function App() {
  return (
    <AuthProvider>
      <StampProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MapPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/board" element={<BoardPage />} />
            <Route path="/board/:id" element={<BoardDetailPage />} />
            <Route path="/maptest" element={<MapTestPage />} />
          </Routes>
        </BrowserRouter>
      </StampProvider>
    </AuthProvider>
  );
}

export default App;
