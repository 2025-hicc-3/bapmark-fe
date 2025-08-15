import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import { StampProvider } from './store/StampContext';
import { PostProvider } from './store/PostContext';
import MapPage from './pages/MapPage';
import MapTestPage from './pages/MapTestPage';
import BoardPage from './pages/BoardPage';
import BoardDetailPage from './pages/BoardDetailPage';
import ApiTestPage from './pages/ApiTestPage';

function App() {
  return (
    <AuthProvider>
      <StampProvider>
        <PostProvider>
          <BrowserRouter>
                                    <Routes>
                          <Route path="/" element={<MapPage />} />
                          <Route path="/map" element={<MapPage />} />
                          <Route path="/board" element={<BoardPage />} />
                          <Route path="/board/:id" element={<BoardDetailPage />} />
                          <Route path="/maptest" element={<MapTestPage />} />
                          <Route path="/apitest" element={<ApiTestPage />} />
                        </Routes>
          </BrowserRouter>
        </PostProvider>
      </StampProvider>
    </AuthProvider>
  );
}

export default App;
