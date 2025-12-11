import { useState, useEffect } from 'react';
import { getRecentEvents, getTestHeatEvents } from '../services/api';

export const useHeatwaveData = (isTestMode = false) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const events = isTestMode ? await getTestHeatEvents() : await getRecentEvents();
        if (events && Array.isArray(events)) {
          console.log('API Response:', events[0]); // Debug log
          const mappedData = events.map(event => ({
            id: event.cityId,
            name: event.city,
            lat: event.lat,
            lng: event.lon, // API uses lon, we use lng
            temp: event.tempC,
            heatWeight: event.heatWeight,
            status: getRiskLevel(event.heatWeight),
            timestamp: event.ts,
            ...event // Spread other props just in case
          }));

          // Deduplicate by city ID, keeping the most recent entry
          const uniqueDataMap = new Map();
          mappedData.forEach(item => {
            const existing = uniqueDataMap.get(item.id);
            if (!existing || new Date(item.timestamp) > new Date(existing.timestamp)) {
              uniqueDataMap.set(item.id, item);
            }
          });

          const uniqueData = Array.from(uniqueDataMap.values());
          setData(uniqueData);
        }
      } catch (err) {
        console.error('Failed to fetch heatwave data:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    // Helper to determine risk level from heatWeight
    const getRiskLevel = (weight) => {
      const w = parseFloat(weight);
      if (isNaN(w)) return 'Safe'; // Default to safe if invalid
      if (w >= 6) return 'Extreme';
      if (w >= 4) return 'Dangerous';
      if (w >= 2) return 'Caution';
      return 'None';
    };

    // Initial fetch
    fetchData();

    // Poll every 5 minutes (300,000 ms) as requested
    const interval = setInterval(fetchData, 300000);

    return () => clearInterval(interval);
  }, [isTestMode]);

  return data;
};
