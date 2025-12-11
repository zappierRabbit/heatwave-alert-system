import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AlertContext = createContext();

export const useAlerts = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const addAlert = React.useCallback((newAlert) => {
        setAlerts((prev) => [newAlert, ...prev]);
        setUnreadCount((prev) => prev + 1);
    }, []);

    // Replace all alerts (useful for full updates)
    const replaceAlerts = React.useCallback((newAlerts) => {
        setAlerts((prev) => {
            // Simple equality check to avoid redundant updates if possible, 
            // but for now just update. 
            // Better to avoid infinite loop by memoizing the function itself.
            return newAlerts;
        });
        const unread = newAlerts.filter(a => !a.read).length;
        setUnreadCount(unread);
    }, []);

    const markAsRead = React.useCallback((alertId) => {
        setAlerts((prev) =>
            prev.map((alert) =>
                alert.id === alertId ? { ...alert, read: true } : alert
            )
        );
        // Correctly recalculate unread count
        setUnreadCount((prev) => Math.max(0, prev - 1));
    }, []);

    const clearUnreadCount = React.useCallback(() => {
        setUnreadCount(0);
        setAlerts(prev => prev.map(a => ({ ...a, read: true })));
    }, []);

    const value = React.useMemo(() => ({
        alerts,
        unreadCount,
        markAsRead,
        clearUnreadCount,
        addAlert,
        replaceAlerts
    }), [alerts, unreadCount, markAsRead, clearUnreadCount, addAlert, replaceAlerts]);

    return (
        <AlertContext.Provider value={value}>
            {children}
        </AlertContext.Provider>
    );
};
