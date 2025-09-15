import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import UserForm from './pages/UserForm';
import UserDetails from './pages/UserDetails';
import EditUser from './pages/EditUser';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="container" style={{ marginTop: '20px' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users/new" element={<UserForm />} />
            <Route path="/users/:id" element={<UserDetails />} />
            <Route path="/users/:id/edit" element={<EditUser />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
