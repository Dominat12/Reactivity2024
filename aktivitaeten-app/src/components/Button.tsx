import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary' }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-semibold text-white transition-colors duration-300';
  const variantClasses = {
    primary: 'bg-claude-green hover:bg-green-600',
    secondary: 'bg-claude-blue hover:bg-blue-600',
    danger: 'bg-claude-red hover:bg-red-600',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;