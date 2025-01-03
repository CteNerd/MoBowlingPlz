import React, { useState } from 'react';
import { checkUsername, checkEmail } from '../api/apiClient';

const SignupComponent: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear error for the specific field
  };

  const handleBlur = async (field: string) => {
    try {
      if (field === 'username') {
        await checkUsername(formData.username);
      } else if (field === 'email') {
        await checkEmail(formData.email);
      }
    } catch (error) {
      setErrors({ ...errors, [field]: `The ${field} is already in use.` });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrors({ ...errors, password: 'Passwords do not match' });
      return;
    }
    // Add logic to handle signup
    console.log('Signup data:', formData);
  };

  const isFormValid = () => {
    return (
      formData.name &&
      formData.username &&
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword
    );
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            title="Please enter your full name"
          />
        </label>
        <br />
        <label>
          Username:
          <input
            type="text"
            name="username"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
            onBlur={() => handleBlur('username')}
            title="Choose a unique username"
          />
        </label>
        {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
        <br />
        <label>
          Email:
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
            title="Enter a valid email address"
          />
        </label>
        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            placeholder="Enter a password"
            value={formData.password}
            onChange={handleChange}
            title="Choose a strong password"
          />
        </label>
        <br />
        <label>
          Confirm Password:
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            title="Re-enter your password"
          />
        </label>
        {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
        <br />
        <button type="submit" disabled={!isFormValid()}>Sign Up</button>
      </form>
    </div>
  );
};

export default SignupComponent;