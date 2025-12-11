import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Loader2, AlertCircle, Calendar, Filter } from 'lucide-react';
import axios from 'axios';

const CITIES = [
    { name: 'Karachi', lat: 24.8607, lon: 67.0011 },
    { name: 'Lahore', lat: 31.5204, lon: 74.3587 },
    { name: 'Islamabad', lat: 33.6844, lon: 73.0479 },
    { name: 'Peshawar', lat: 34.0151, lon: 71.5249 },
    { name: 'Quetta', lat: 30.1798, lon: 66.9750 },
    { name: 'Multan', lat: 30.1575, lon: 71.5249 },
    { name: 'Faisalabad', lat: 31.5497, lon: 73.0529 },
    { name: 'Sialkot', lat: 32.4945, lon: 74.5229 },
    { name: 'Hyderabad', lat: 25.3960, lon: 68.3578 },
    { name: 'Rawalpindi', lat: 33.5651, lon: 73.0169 },
];

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const YEARS = [2024, 2023, 2022];

// Helper to determine color based on temperature
const getTempColor = (temp) => {
    if (temp < 15) return '#3b82f6'; // Cold - Blue
    if (temp < 25) return '#10b981'; // Pleasant - Green
    if (temp < 35) return '#f59e0b'; // Warm - Orange
    return '#ef4444'; // Hot - Red
};

export function HistoricalWeatherChart({ embedded = false }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter States
    const [timeRange, setTimeRange] = useState('24h'); // '24h' or 'month'
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const fetchHistoricalData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Use a slight delay if embedded to prioritize other dashboard loads
                if (embedded) await new Promise(r => setTimeout(r, 500));

                let startDate, endDate;
                const formatDate = (date) => date.toISOString().split('T')[0];

                const requests = CITIES.map(city => {
                    const params = {
                        latitude: city.lat,
                        longitude: city.lon,
                        timezone: 'Asia/Karachi'
                    };

                    if (timeRange === '24h') {
                        // Last 24 hours (Yesterday)
                        endDate = new Date();
                        endDate.setDate(endDate.getDate() - 1);
                        startDate = new Date(endDate);

                        params.start_date = formatDate(startDate);
                        params.end_date = formatDate(endDate);
                        params.hourly = 'temperature_2m,apparent_temperature';
                    } else {
                        // Selected Month
                        startDate = new Date(selectedYear, selectedMonth, 1);
                        endDate = new Date(selectedYear, selectedMonth + 1, 0); // Last day of month

                        // CLAMP: Cap end_date to today if the month is current/future
                        const today = new Date();
                        // Reset time parts to compare dates correctly
                        today.setHours(0, 0, 0, 0);

                        if (endDate > today) {
                            // If last day of month is in future, use today
                            endDate = today;
                        }

                        params.start_date = formatDate(startDate);
                        params.end_date = formatDate(endDate);
                        params.daily = 'temperature_2m_max,apparent_temperature_max';
                    }

                    return axios.get(`https://archive-api.open-meteo.com/v1/archive`, { params });
                });

                const responses = await Promise.all(requests);

                const processedData = responses.map((response, index) => {
                    let maxTemp = 0, maxHeatIndex = 0;

                    if (timeRange === '24h') {
                        const hourly = response.data.hourly;
                        if (hourly && hourly.temperature_2m && hourly.temperature_2m.length > 0) {
                            maxTemp = Math.max(...hourly.temperature_2m);
                            maxHeatIndex = Math.max(...hourly.apparent_temperature);
                        }
                    } else {
                        const daily = response.data.daily;
                        if (daily && daily.temperature_2m_max && daily.temperature_2m_max.length > 0) {
                            maxTemp = Math.max(...daily.temperature_2m_max);
                            maxHeatIndex = Math.max(...daily.apparent_temperature_max);
                        }
                    }

                    // Handle potential -Infinity if array was somehow valid but empty or issues
                    if (!isFinite(maxTemp)) maxTemp = 0;
                    if (!isFinite(maxHeatIndex)) maxHeatIndex = 0;

                    return {
                        name: CITIES[index].name,
                        maxTemp: parseFloat(maxTemp.toFixed(1)),
                        maxHeatIndex: parseFloat(maxHeatIndex.toFixed(1)),
                    };
                });

                setData(processedData);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching historical data:", err);
                setError("Failed to load historical weather data.");
                setLoading(false);
            }
        };

        fetchHistoricalData();
    }, [timeRange, selectedMonth, selectedYear, embedded]);

    return (
        <div className={embedded ? "w-full flex flex-col gap-4" : "p-6 h-full flex flex-col bg-slate-50/50"}>
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className={`font-bold text-slate-800 ${embedded ? "text-lg" : "text-2xl"}`}>
                        Historical Weather Analysis
                    </h2>
                    {!embedded && (
                        <p className="text-slate-500">
                            {timeRange === '24h'
                                ? 'Peak metrics for Yesterday (Last 24 Hours)'
                                : `Peak metrics for ${MONTHS[selectedMonth]} ${selectedYear}`}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200 shadow-sm self-start md:self-auto">
                    <Filter size={18} className="text-slate-400 ml-2" />

                    {/* Range Selector */}
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="bg-transparent border-none text-sm font-medium text-slate-700 focus:ring-0 cursor-pointer"
                    >
                        <option value="24h">Last 24h</option>
                        <option value="month">Monthly</option>
                    </select>

                    {/* Month/Year Selectors (Only visible if Monthly View) */}
                    {timeRange === 'month' && (
                        <>
                            <div className="w-px h-6 bg-slate-200 mx-1" />
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-sm text-slate-600 focus:outline-none cursor-pointer"
                            >
                                {MONTHS.map((m, i) => (
                                    <option key={m} value={i}>{m}</option>
                                ))}
                            </select>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-sm text-slate-600 focus:outline-none cursor-pointer"
                            >
                                {YEARS.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </>
                    )}
                </div>
            </div>

            {/* Chart */}
            <div
                className={`bg-white border border-slate-100 ${embedded ? "rounded-3xl shadow-card p-6 h-96" : "flex-1 rounded-xl shadow-sm p-6 min-h-[400px]"}`}
            >
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                        <Loader2 className="animate-spin" size={32} />
                        <p>Fetching weather archive...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-full text-red-400 gap-3">
                        <AlertCircle size={32} />
                        <p>{error}</p>
                    </div>
                ) : (
                    <div style={{ width: '100%', height: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="name"
                                    angle={-45}
                                    textAnchor="end"
                                    interval={0}
                                    height={80}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                />
                                <YAxis
                                    label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', fill: '#64748b' }}
                                    tick={{ fill: '#64748b' }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="top" height={36} />

                                {/* Max Temp Bar with Dynamic Colors */}
                                <Bar dataKey="maxTemp" name="Max Temp (°C)" radius={[4, 4, 0, 0]} barSize={20}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-temp-${index}`} fill={getTempColor(entry.maxTemp)} />
                                    ))}
                                </Bar>

                                {/* Max Heat Index Bar with Dynamic Colors (slightly darker/saturated) */}
                                <Bar dataKey="maxHeatIndex" name="Max Heat Index (°C)" radius={[4, 4, 0, 0]} barSize={20}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-heat-${index}`} fill={getTempColor(entry.maxHeatIndex)} fillOpacity={0.8} stroke={getTempColor(entry.maxHeatIndex)} strokeWidth={1} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
}
