import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <nav className="p-4">
        <Link to="/" className="text-white mx-2 hover:text-gray-300">Inicio</Link>
        <span className="text-white">|</span>
        <Link to="/admin" className="text-white mx-2 hover:text-gray-300">Panel Administrativo</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;