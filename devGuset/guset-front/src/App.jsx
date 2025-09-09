import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Dining from './pages/Dining';
import Facilities from './pages/Facilities';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/services" element={<Services />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dining" element={<Dining />} /> {/* New route */}
        <Route path="/facilities" element={<Facilities />} /> {/* New route */}
      </Routes>
    </Router>
  );
};

export default App;
