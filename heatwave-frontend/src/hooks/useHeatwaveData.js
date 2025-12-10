import { useState, useEffect } from 'react';
import { PAKISTAN_CITIES } from '../data/cities';

export const useHeatwaveData = () => {
  const [data, setData] = useState([]);

  const generateData = () => {
    return PAKISTAN_CITIES.map((city) => {
      // Use baseTemp from city data with random fluctuation
      const baseTemp = city.baseTemp || 35;

      // Add random fluctuation for variety (±3°C)
      const currentTemp = baseTemp + Math.random() * 6 - 3;

      let status = 'Normal';
      if (currentTemp >= 40) status = 'Warning';
      if (currentTemp >= 45) status = 'Critical';

      return {
        ...city,
        temp: parseFloat(currentTemp.toFixed(1)),
        humidity: Math.floor(Math.random() * (70 - 20) + 20),
        status,
        timestamp: new Date().toISOString(),
      };
    });
  };

  useEffect(() => {
    // Initial load
    setData(generateData());

    // Update every 5 seconds to simulate real-time data
    const interval = setInterval(() => {
      setData((prevData) => {
        return prevData.map((cityData) => {
          // Smooth transition - small random change
          const change = (Math.random() - 0.5) * 0.8;
          let newTemp = cityData.temp + change;

          // Clamp to reasonable bounds based on base temp
          const minTemp = Math.max(15, (cityData.baseTemp || 35) - 5);
          const maxTemp = Math.min(52, (cityData.baseTemp || 35) + 5);
          newTemp = Math.max(minTemp, Math.min(maxTemp, newTemp));

          let status = 'Normal';
          if (newTemp >= 40) status = 'Warning';
          if (newTemp >= 45) status = 'Critical';

          return {
            ...cityData,
            temp: parseFloat(newTemp.toFixed(1)),
            status,
            timestamp: new Date().toISOString(),
          };
        });
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return data;
};
