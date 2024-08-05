import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavigationBar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-claude-green p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">Aktivitäten-App</Link>
        <div>
          {isAuthenticated ? (
            <>
              <Link to="/" className="text-white mr-4 hover:underline">Aktivitäten</Link>
              <Link to="/my-activities" className="text-white mr-4 hover:underline">Meine Aktivitäten</Link>
              <Link to="/create" className="text-white mr-4 hover:underline">Neue Aktivität</Link>
              <Link to="/profile" className="text-white mr-4 hover:underline">Mein Profil</Link>
              <button onClick={handleLogout} className="text-white hover:underline">Logout</button>
            </>
          ) : (
            <Link to="/login" className="text-white hover:underline">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;