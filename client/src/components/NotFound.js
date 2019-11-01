import React from 'react';
import image from '../images/sadcowboy.jpg';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <img
        src={image}
        style={{ width: '50%', margin: 'auto', display: 'block' }}
        alt="404 not found"
      />
      <h1>404, cowboy</h1>
    </div>
  );
};

export default NotFound;
