import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <nav className="bg-gunpla-secondary text-gunpla-primary shadow-md border-b-4 border-gunpla-accent-red">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          <ShieldAlert className="text-gunpla-accent-yellow" />
          Gunpla Archive
        </Link>
        <div className="flex gap-4 items-center">
          <Link to="/" className="hover:text-gunpla-accent-yellow transition-colors font-medium">Global Feed</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:text-gunpla-accent-yellow transition-colors font-medium">My Dashboard</Link>
              <button 
                onClick={handleLogout}
                className="bg-gunpla-primary text-gunpla-secondary px-4 py-1.5 rounded-sm font-bold hover:bg-gray-100 transition-colors shadow-[2px_2px_0px_rgba(220,38,38,1)] active:translate-y-1 active:shadow-none"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gunpla-accent-yellow transition-colors font-medium">Login</Link>
              <Link to="/register" className="bg-gunpla-accent-yellow text-gunpla-dark px-4 py-1.5 rounded-sm font-bold hover:brightness-110 transition-colors shadow-[2px_2px_0px_rgba(220,38,38,1)] active:translate-y-1 active:shadow-none">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
