import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './LogInPage.css'; 
import { login } from '../../api';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/HomePage');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="login-container">  
      <h1 className="h1-design">Log In</h1>
      <form className="login-form" onSubmit={handleSubmit}>  
        <div className="form-group">  
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group"> 
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Link className="signin-link" to="/SignInPage">Don't have an account? Sign Up!</Link>  
        <button className="login-button" type="submit">Login</button>  
         </form>
    </div>
  );
}

export default LoginForm;
