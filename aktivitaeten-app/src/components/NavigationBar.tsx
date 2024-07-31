import React from 'react';
import { Link } from 'react-router-dom';

const NavigationBar: React.FC = () => {
  return (
    <nav className="bg-claude-green p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">Aktivitäten-App</Link>
        <div>
          <Link to="/" className="text-white mr-4 hover:underline">Aktivitäten</Link>
          <Link to="/create" className="text-white hover:underline">Neue Aktivität</Link>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;