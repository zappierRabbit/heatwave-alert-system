import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useAlerts } from '../../context/AlertContext';

const Toast = ({ alert, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const getIcon = () => {
        switch (alert.severity) {
            case 'critical': return <AlertTriangle className="text-red-500" size={24} />;
            case 'warning': return <AlertCircle className="text-orange-500" size={24} />;
            default: return <Info className="text-blue-500" size={24} />;
        }
    };

    const getBorderColor = () => {
        switch (alert.severity) {
            case 'critical': return 'border-l-4 border-l-red-500';
            case 'warning': return 'border-l-4 border-l-orange-500';
            default: return 'border-l-4 border-l-blue-500';
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`bg-white shadow-xl rounded-lg p-4 mb-3 flex items-start gap-3 w-80 pointer-events-auto border border-slate-100 ${getBorderColor()}`}
        >
            <div className="shrink-0 mt-0.5">{getIcon()}</div>
            <div className="flex-1">
                <h4 className="font-semibold text-slate-800 text-sm">{alert.severity.toUpperCase()} ALERT</h4>
                <p className="text-slate-600 text-xs mt-1 leading-snug">{alert.message}</p>
                <span className="text-[10px] text-slate-400 mt-2 block">{new Date(alert.timestamp).toLocaleTimeString()}</span>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={16} />
            </button>
        </motion.div>
    );
};

export const NotificationToast = () => {
    const { alerts } = useAlerts();
    const [visibleAlerts, setVisibleAlerts] = useState([]);

    // When alerts change, if the new one is more recent than what we have shown, add it (simplified logic for now, just checking length)
    // A better way is to see if the latest alert in 'alerts' is new.

    useEffect(() => {
        if (alerts.length > 0) {
            const latestAlert = alerts[0];
            // Check if this alert is already visible or dismissed (crudely by checking ID presence in recent history or simplified)
            // For this demo, we'll maintain a local state of "active toasts"
            // We only want to show the *most recent* one if it just arrived

            // Actually, let's just show the latest one if it's less than 2 seconds old (simulating "just happened")
            // detailed logic: Context adds to front. 

            const isRecent = (new Date() - new Date(latestAlert.timestamp)) < 2000;
            if (isRecent) {
                setVisibleAlerts(prev => {
                    if (prev.find(a => a.id === latestAlert.id)) return prev;
                    return [latestAlert, ...prev].slice(0, 3); // Max 3 toasts
                });
            }
        }
    }, [alerts]);

    const removeToast = (id) => {
        setVisibleAlerts((prev) => prev.filter((a) => a.id !== id));
    };

    return (
        <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end pointer-events-none gap-2">
            <AnimatePresence>
                {visibleAlerts.map((alert) => (
                    <Toast key={alert.id} alert={alert} onClose={() => removeToast(alert.id)} />
                ))}
            </AnimatePresence>
        </div>
    );
};
