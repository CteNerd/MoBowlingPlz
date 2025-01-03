import React, { useEffect, useState } from 'react';
import { getWeatherForecast } from '../api/apiClient';
import { WeatherForecast } from '../models/WeatherForecast';

const WeatherComponent = () => {
  const [forecast, setForecast] = useState<WeatherForecast[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWeatherForecast();
        setForecast(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Weather Forecast Today</h1>
      <ul>
        {forecast.map((item: WeatherForecast, index: number) => (
          <li key={index}>{item.summary}</li>
        ))}
      </ul>
    </div>
  );
};

export default WeatherComponent;