import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './login';
import Register from './register';
import Home from './home';  // Assuming you want to create a Home component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />  {/* Define the root route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
