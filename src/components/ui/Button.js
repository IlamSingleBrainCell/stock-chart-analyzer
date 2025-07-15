import React from 'react';

const Button = ({ children, onClick, className = '', variant = 'primary' }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-semibold focus:outline-none';
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default Button;
