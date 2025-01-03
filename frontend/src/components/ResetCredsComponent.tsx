import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetCredsComponent: React.FC = () => {
  const [forgotType, setForgotType] = useState<'username' | 'password' | ''>('');
  const [input, setInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleReset = () => {
    // Call API to reset password or send username
    console.log('Reset request for:', input);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/'); // Redirect to login page
  };

  return (
    <div>
      <h1>Reset Credentials</h1>
      <div>
        <button onClick={() => setForgotType('username')}>Forgot Username</button>
        <button onClick={() => setForgotType('password')}>Forgot Password</button>
      </div>
      {forgotType && (
        <div>
          <label>
            {forgotType === 'password' ? 'Username or Email:' : 'Email:'}
            <input
              type="text"
              placeholder={forgotType === 'password' ? 'Enter your username' : 'Enter your email'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              title={forgotType === 'password' ? 'Enter your username to reset password' : 'Enter your email to retrieve username'}
            />
          </label>
          <br />
          <button onClick={handleReset}>Submit</button>
        </div>
      )}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>A reset link will be sent to your email if an account is found.</p>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetCredsComponent;