import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AlertContext = createContext();

export const useAlerts = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Dummy data generator
    const cities = ['Karachi', 'Lahore', 'Islamabad', 'Multan', 'Peshawar', 'Quetta', 'Faisalabad', 'Hyderabad'];
    const severities = ['critical', 'warning', 'info'];
    const messages = {
        critical: ['Heatwave imminent! Temperatures reaching dangerously high levels.', 'Extreme heat alert. Stay indoors.'],
        warning: ['High temperature warning. Drink plenty of water.', 'UV Index is high. Avoid direct sunlight.'],
        info: ['Weather update: Sunny skies expected.', 'Cooling centers are now open in your area.']
    };

    const addAlert = (newAlert) => {
        setAlerts((prev) => [newAlert, ...prev]);
        setUnreadCount((prev) => prev + 1);
    };

    const markAsRead = (alertId) => {
        setAlerts((prev) =>
            prev.map((alert) =>
                alert.id === alertId ? { ...alert, read: true } : alert
            )
        );
        // Update unread count logic if needed, but for now simple increment/decrement is tricky with bulk operations or if we want to keep "unread" state persistent.
        // Let's simple re-calculate unread count
        setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    const clearUnreadCount = () => {
        setUnreadCount(0);
        setAlerts(prev => prev.map(a => ({ ...a, read: true })));
    }

    // Simulate incoming alerts
    useEffect(() => {
        // Add some initial dummy alerts
        const initialAlerts = Array.from({ length: 3 }).map(() => generateRandomAlert());
        setAlerts(initialAlerts);
        setUnreadCount(3);

        const interval = setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance to add an alert every 10 seconds
                const alert = generateRandomAlert();
                addAlert(alert);
            }
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const generateRandomAlert = () => {
        const severity = severities[Math.floor(Math.random() * severities.length)];
        const city = cities[Math.floor(Math.random() * cities.length)];
        const messageTemplate = messages[severity][Math.floor(Math.random() * messages[severity].length)];

        return {
            id: uuidv4(),
            city,
            severity,
            message: `${city}: ${messageTemplate}`,
            timestamp: new Date().toISOString(),
            read: false,
        };
    };

    return (
        <AlertContext.Provider value={{ alerts, unreadCount, markAsRead, clearUnreadCount }}>
            {children}
        </AlertContext.Provider>
    );
};
