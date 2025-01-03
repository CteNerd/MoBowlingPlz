import React, { useState } from 'react';
import { login } from '../api/apiClient';
import { useNavigate } from 'react-router-dom';

const LoginComponent: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/'); // Redirect to home page on success
    } catch (error) {
      setError('Invalid username/password combination');
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    setError(''); // Clear error when user starts typing
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input type="text" value={username} onChange={handleInputChange(setUsername)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={handleInputChange(setPassword)} />
        </label>
        <br />
        <button type="submit">Login</button>
        <button type="button" onClick={() => navigate('/signup')}>Sign Up</button>
        <button type="button" onClick={() => navigate('/reset-creds')}>Forgot Username/Password</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default LoginComponent;