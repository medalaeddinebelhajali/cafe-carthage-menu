import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenuPage from './components/MenuPage.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import AdminLogin from "./components/AdminLogin.tsx";

function App() {
  return (
    <Router>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<MenuPage />} />
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<MenuPage />} />
          </Routes>
        </main>
    </Router>
  );
}

export default App;
