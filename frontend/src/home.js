import React from 'react';
import { Link } from 'react-router-dom';

function Welcome() {
  return (
    <div>
      <h1>Welcome to the App!</h1>
      <Link to="/register">Go to Register</Link>
    </div>
  );
}

export default Welcome;
