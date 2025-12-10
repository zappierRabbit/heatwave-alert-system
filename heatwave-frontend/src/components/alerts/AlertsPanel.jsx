import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, Filter, ArrowLeft, Clock } from 'lucide-react';
import { useAlerts } from '../../context/AlertContext';

export const AlertsPanel = ({ onBack }) => {
    const { alerts, markAsRead } = useAlerts();
    const [filter, setFilter] = useState('all'); // all, critical, warning, info

    const filteredAlerts = alerts.filter(alert =>
        filter === 'all' ? true : alert.severity === filter
    );

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return 'bg-red-50 text-red-700 border-red-200';
            case 'warning': return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'info': return 'bg-blue-50 text-blue-700 border-blue-200';
            default: return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    const getIcon = (severity) => {
        switch (severity) {
            case 'critical': return <AlertTriangle size={20} />;
            case 'warning': return <AlertCircle size={20} />;
            default: return <Info size={20} />;
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 z-10">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <AlertTriangle className="text-red-500" />
                        Alert Center
                    </h2>
                    <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-xs font-medium">
                        Last 24 Hours
                    </span>
                </div>

                {onBack && (
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <ArrowLeft size={20} />
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="px-6 py-4 flex gap-2 overflow-x-auto shrink-0">
                {['all', 'critical', 'warning', 'info'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${filter === f
                                ? 'bg-slate-800 text-white shadow-md'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Alerts List */}
            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3">
                <AnimatePresence initial={false}>
                    {filteredAlerts.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-20 text-slate-400"
                        >
                            <AlertCircle size={48} className="mb-4 opacity-20" />
                            <p>No alerts found matching your criteria.</p>
                        </motion.div>
                    ) : (
                        filteredAlerts.map((alert, index) => (
                            <motion.div
                                key={alert.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                className={`w-full p-4 rounded-xl border flex items-start gap-4 shadow-sm relative overflow-hidden group ${getSeverityColor(alert.severity)}`}
                                onMouseEnter={() => !alert.read && markAsRead(alert.id)}
                            >
                                {/* Unread Indicator */}
                                {!alert.read && (
                                    <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-bl-lg shadow-sm" />
                                )}

                                <div className={`p-2 rounded-lg bg-white/50 shrink-0`}>
                                    {getIcon(alert.severity)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-4 mb-1">
                                        <h3 className="font-bold text-base leading-tight">
                                            {alert.severity.toUpperCase()} - {alert.city}
                                        </h3>
                                        <div className="flex items-center gap-1 text-xs opacity-70 shrink-0">
                                            <Clock size={12} />
                                            <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm opacity-90 leading-relaxed pr-8">
                                        {alert.message}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
