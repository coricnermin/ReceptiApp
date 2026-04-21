import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

function Register({ setUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      navigate('/');
    } catch (err) {
      setError('Greška pri registraciji. Pokušajte ponovo.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Pridružite nam se!</h2>
        <p className="subtitle">Ubrzo nakon registracije dijelite svoje recepte s nama.</p>

        {error && <div style={{ color: '#e74c3c', backgroundColor: '#fdf0ed', padding: '10px', borderRadius: '6px', fontSize: '14px', marginBottom: '15px' }}>{error}</div>}

        <form onSubmit={handleRegister} autoComplete="off">
          <div className="form-group">
            <label>Ime i prezime</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Unesite vaše ime" autoComplete="off" />
          </div>
          <div className="form-group">
            <label>Email adresa</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Unesite email" autoComplete="off" />
          </div>
          <div className="form-group">
            <label>Lozinka</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Odaberite lozinku" autoComplete="new-password" />
          </div>
          <button type="submit" className="btn btn-block">Registruj se</button>
        </form>

        <p style={{ marginTop: '25px', fontSize: '14px' }}>Imate nalog? <Link to="/login">Prijavite se</Link></p>
      </div>
    </div>
  );
}

export default Register;