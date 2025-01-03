import React, { useState } from 'react';

const CreateGameComponent: React.FC = () => {
  const [gameDetails, setGameDetails] = useState({
    eventName: '',
    date: '',
    time: '',
    location: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
    numberOfPlayers: 0,
  });

  const [playerEmails, setPlayerEmails] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGameDetails({ ...gameDetails, [e.target.name]: e.target.value });
  };

  const handlePlayersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numPlayers = parseInt(e.target.value, 10) || 0;
    setGameDetails({ ...gameDetails, numberOfPlayers: numPlayers });
    setPlayerEmails(Array(numPlayers).fill(''));
  };

  const handleEmailChange = (index: number, email: string) => {
    const newEmails = [...playerEmails];
    newEmails[index] = email;
    setPlayerEmails(newEmails);
  };

  const isFormValid = () => {
    const { eventName, date, time, location, addressLine1, city, state, zip, numberOfPlayers } = gameDetails;
    return (
      eventName &&
      date &&
      time &&
      location &&
      addressLine1 &&
      city &&
      state &&
      zip &&
      numberOfPlayers > 0 &&
      playerEmails.some(email => email)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to handle game creation and sending invites
    console.log('Game Details:', gameDetails);
    console.log('Player Emails:', playerEmails);
  };

  return (
    <div>
      <h1>Create Game</h1>
        <h3>Event Details</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Event Name:
          <input
            type="text"
            name="eventName"
            value={gameDetails.eventName}
            onChange={handleChange}
            placeholder="Enter event name"
          />
        </label>
        <br />
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={gameDetails.date}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Time:
          <input
            type="time"
            name="time"
            value={gameDetails.time}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Location:
          <input
            type="text"
            name="location"
            value={gameDetails.location}
            onChange={handleChange}
            placeholder="Enter location"
          />
        </label>
        <br />
        <h3>Address</h3>
        <label>
          Address Line 1:
          <input
            type="text"
            name="addressLine1"
            value={gameDetails.addressLine1}
            onChange={handleChange}
            placeholder="Enter address line 1"
          />
        </label>
        <br />
        <label>
          Address Line 2:
          <input
            type="text"
            name="addressLine2"
            value={gameDetails.addressLine2}
            onChange={handleChange}
            placeholder="Enter address line 2"
          />
        </label>
        <br />
        <label>
          City:
          <input
            type="text"
            name="city"
            value={gameDetails.city}
            onChange={handleChange}
            placeholder="Enter city"
          />
        </label>
        <br />
        <label>
          State:
          <input
            type="text"
            name="state"
            value={gameDetails.state}
            onChange={handleChange}
            placeholder="Enter state"
          />
        </label>
        <br />
        <label>
          Zip:
          <input
            type="text"
            name="zip"
            value={gameDetails.zip}
            onChange={handleChange}
            placeholder="Enter zip code"
          />
        </label>
        <br />
        <h3> Roster Details</h3>
        <label>
          Number of Players:
          <input
            type="number"
            name="numberOfPlayers"
            value={gameDetails.numberOfPlayers}
            onChange={handlePlayersChange}
            min="0"
          />
        </label>
        <br />
        {playerEmails.map((email, index) => (
          <div key={index}>
            <label>
              Player {index + 1} Email:
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(index, e.target.value)}
                placeholder="Enter player email"
              />
            </label>
          </div>
        ))}
        <br />
        <button type="submit" disabled={!isFormValid()}>Create Game</button>
      </form>
    </div>
  );
};

export default CreateGameComponent;