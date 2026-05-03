import React, { useState } from 'react';
import axios from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-gunpla-primary p-8 border-2 border-gunpla-secondary shadow-[8px_8px_0px_rgba(29,78,216,1)] rounded-sm">
      <h2 className="text-3xl font-bold text-gunpla-secondary mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-gunpla-accent-red inline-block"></span>
        SYSTEM LOGIN
      </h2>
      {error && <div className="bg-gunpla-accent-red/10 border-l-4 border-gunpla-accent-red text-gunpla-accent-red p-3 mb-4 font-medium">{error}</div>}
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div>
          <label className="block text-gunpla-dark font-medium mb-1 uppercase text-sm tracking-wider">Email Designation</label>
          <input 
            type="email" 
            className="w-full border-2 border-gray-300 p-2 focus:border-gunpla-secondary focus:outline-none transition-colors"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label className="block text-gunpla-dark font-medium mb-1 uppercase text-sm tracking-wider">Access Code</label>
          <input 
            type="password" 
            className="w-full border-2 border-gray-300 p-2 focus:border-gunpla-secondary focus:outline-none transition-colors"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="mt-4 bg-gunpla-secondary text-gunpla-primary py-3 font-bold uppercase tracking-widest hover:bg-blue-800 transition-colors shadow-[4px_4px_0px_rgba(220,38,38,1)] active:translate-y-1 active:shadow-[2px_2px_0px_rgba(220,38,38,1)]">
          Authorize
        </button>
      </form>
      <p className="mt-6 text-center text-gray-600">
        New pilot? <Link to="/register" className="text-gunpla-secondary font-bold hover:underline">Register here</Link>
      </p>
    </div>
  );
}
