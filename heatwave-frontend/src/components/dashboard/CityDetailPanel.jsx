import React from 'react';
import { X, Thermometer, Droplets, Wind, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CityDetailPanel = ({ city, onClose }) => {
    if (!city) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Extreme':
            case 'Dangerous':
                return 'bg-red-100 text-red-600';
            case 'Caution':
                return 'bg-amber-100 text-amber-600';
            case 'None':
            default:
                return 'bg-emerald-100 text-emerald-600';
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute right-0 top-0 h-full w-96 border-l border-slate-200 bg-white/90 p-6 backdrop-blur-xl z-[500] shadow-2xl"
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900"
                >
                    <X size={20} />
                </button>

                <div className="mt-8">
                    <span className="text-sm font-medium text-slate-500">{city.province}</span>
                    <h2 className="text-4xl font-bold text-slate-900 mb-2">{city.name}</h2>

                    <div className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(city.status)}`}>
                        {city.status}
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-2 gap-4">
                    <div className="col-span-2 rounded-2xl bg-white p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <Thermometer className="text-red-500" size={24} />
                            <span className="text-slate-500">Temperature</span>
                        </div>
                        <div className="text-5xl font-mono text-slate-900">{city.temp}°C</div>
                    </div>

                    <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <Droplets className="text-blue-500" size={20} />
                            <span className="text-slate-500 text-sm">Humidity</span>
                        </div>
                        <div className="text-2xl font-mono text-slate-900">{city.humidity}%</div>
                    </div>

                    <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <Activity className="text-purple-500" size={20} />
                            <span className="text-slate-500 text-sm">Risk Index</span>
                        </div>
                        <div className="text-2xl font-mono text-slate-900">{city.riskLevel || city.status}</div>
                    </div>

                    <div className="col-span-2 rounded-2xl bg-white p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <Wind className="text-orange-500" size={20} />
                            <span className="text-slate-500 text-sm">PMD Heatwave</span>
                        </div>
                        <div className="text-lg font-mono text-slate-900">{city.pmdHeatwave || 'None'}</div>
                    </div>
                </div>


            </motion.div>
        </AnimatePresence>
    );
};
