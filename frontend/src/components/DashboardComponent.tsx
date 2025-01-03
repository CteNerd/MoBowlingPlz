import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGames } from '../api/apiClient';

interface Game {
  id: number;
  name: string;
  date: string;
  location: string;
}

const DashboardComponent: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch upcoming games or tournaments from an API
    const fetchGames = async () => {
      // Replace with actual API call
      const data = await getGames();
      setGames(data);
    };

    fetchGames();
  }, []);

  const handleRegister = (gameId: number) => {
    setSelectedGame(gameId);
    // Logic to register for the game
    console.log(`Registered for game with ID: ${gameId}`);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <button onClick={() => navigate('/create-game')}>Create Game</button>
        <button onClick={() => navigate('/create-tourney')}>Create Tournament</button>
      </div>
      <h2>Upcoming Games/Tournaments</h2>
      <ul>
        {games.map((game) => (
          <li key={game.id}>
            <h3>{game.name}</h3>
            <p>Date: {game.date}</p>
            <p>Location: {game.location}</p>
            <button onClick={() => handleRegister(game.id)}>Register</button>
          </li>
        ))}
      </ul>
      {selectedGame && <p>You have registered for game ID: {selectedGame}</p>}
    </div>
  );
};

export default DashboardComponent;