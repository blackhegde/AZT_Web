import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Header from './@/components/ui/header';
import Footer from './@/components/ui/footer';
import AdminLogin from './pages/Login';
import Admin from './pages/Admin';

function App() {
  const isAdminPage = window.location.pathname.startsWith('/admin');

  return (
    <Router>
      <div className="App">
        {!isAdminPage && <Header />}
        {/* <Header /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<div>Products Page - Coming Soon</div>} />
          <Route path="/about" element={<div>About Page - Coming Soon</div>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;