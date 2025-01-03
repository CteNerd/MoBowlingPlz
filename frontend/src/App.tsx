import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import WeatherComponent from './components/WeatherComponent';
import LoginComponent from './components/LoginComponent';
import ResetCredsComponent from './components/ResetCredsComponent';
import SignupComponent from './components/SignupComponent';
import DashboardComponent from './components/DashboardComponent';
import CreateGameComponent from './components/CreateGameComponent';
import CreateTourneyComponent from './components/CreateTourneyComponent';

const App: React.FC = () => {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/weather" element={<WeatherComponent />} />
        <Route path="/signup" element={<SignupComponent />} />
        <Route path="/reset-creds" element={<ResetCredsComponent />} />
        <Route path="/dashboard" element={<DashboardComponent />} />
        <Route path="/create-game" element={<CreateGameComponent />} />
        <Route path="/create-tourney" element={<CreateTourneyComponent />} />
      
      </Routes>
    </Router>
  );
};

export default App;