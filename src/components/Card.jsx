import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`auth-card fade-in ${className}`}>
      {children}
    </div>
  );
};

export default Card;
