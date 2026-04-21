import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import api from './api';
import './App.css';

import Login from './pages/Login';
import Register from './pages/Register';
import AllRecipes from './pages/AllRecipes';
import MyRecipes from './pages/MyRecipes';
import RecipeForm from './pages/RecipeForm';
import RecipeDetail from './pages/RecipeDetail';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await api.get('/user');
        setUser(res.data);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/logout');
      localStorage.removeItem('token');
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Učitavanje...</div>;

  return (
    <Router>
      <div className="App">
        {user && (
          <nav className="navbar">
            <div className="nav-links">
              <Link to="/">Svi recepti</Link>
              <Link to="/moji-recepti">Moji recepti</Link>
            </div>
            <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
              <span>Dobrodošli, {user.name}</span>
              <button onClick={handleLogout} className="btn btn-danger" style={{padding: '5px 10px'}}>Odjava</button>
            </div>
          </nav>
        )}
        
        <div className="container">
          <Routes>
            <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/" />} />
            
            <Route path="/" element={user ? <AllRecipes /> : <Navigate to="/login" />} />
            <Route path="/moji-recepti" element={user ? <MyRecipes /> : <Navigate to="/login" />} />
            <Route path="/recept/:id" element={user ? <RecipeDetail /> : <Navigate to="/login" />} />
            <Route path="/dodaj-recept" element={user ? <RecipeForm /> : <Navigate to="/login" />} />
            <Route path="/uredi-recept/:id" element={user ? <RecipeForm editMode /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
