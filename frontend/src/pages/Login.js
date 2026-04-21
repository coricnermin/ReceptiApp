import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Greška pri prijavi');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Dobrodošli nazad!</h2>
        <p className="subtitle">Prijavite se kako biste vidjeli i upravljali najboljim receptima.</p>

        {error && <div style={{ color: '#e74c3c', backgroundColor: '#fdf0ed', padding: '10px', borderRadius: '6px', fontSize: '14px', marginBottom: '15px' }}>{error}</div>}

        <form onSubmit={handleLogin} autoComplete="off">
          <div className="form-group">
            <label>Email adresa</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Unesite email" autoComplete="off" />
          </div>
          <div className="form-group">
            <label>Lozinka</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Unesite lozinku" autoComplete="new-password" />
          </div>
          <button type="submit" className="btn btn-block">Prijavi se</button>
        </form>

        <p style={{ marginTop: '25px', fontSize: '14px' }}>Nemate nalog? <Link to="/register">Registrujte se</Link></p>
      </div>
    </div>
  );
}

export default Login;