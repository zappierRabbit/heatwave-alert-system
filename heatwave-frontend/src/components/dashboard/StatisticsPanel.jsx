import React, { useState, useMemo, useEffect } from 'react';
import {
  Copy,
  Share2,
  Expand,
  CheckCircle2,
  X,
  ChevronDown,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Thermometer,
  AlertTriangle,
  Wind,
  Search
} from 'lucide-react';
import { HeatmapMap } from '../map/HeatmapMap';

const SimpleBarChart = ({ title, data, colorClass = "bg-blue-500", getColor }) => {
  // Use a fixed max value of 50 for temperature/heat index to represent the "potential" max heat.
  // This ensures that 19C doesn't look like 100% (Red).
  // For other data types, usage might vary, but for this specific panel, fixed scaling works best for context.
  const maxValue = Math.max(...data.map(d => parseFloat(d.numericValue) || 0), 50);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card flex flex-col h-full">
      <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
        {title}
      </h3>
      <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {data.map((item, i) => {
          const val = parseFloat(item.numericValue) || 0;
          // Determine color: use getColor function if provided, otherwise fallback to colorClass
          const barColor = getColor ? getColor(val) : colorClass;

          return (
            <div key={i} className="group">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-600 truncate max-w-[120px]" title={item.label}>
                  {item.label}
                </span>
                <span className="font-bold text-slate-800">{item.displayValue}</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${barColor} transition-all duration-500 group-hover:opacity-80`}
                  style={{ width: `${Math.min(100, (val / maxValue) * 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subtext, icon: Icon, colorClass }) => (
  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-card flex items-start justify-between">
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
      <h4 className="text-2xl font-bold text-slate-800 mb-1">{value}</h4>
      <p className="text-xs font-medium text-slate-500">{subtext}</p>
    </div>
    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${colorClass}`}>
      <Icon size={20} className="text-white" />
    </div>
  </div>
);

export const StatisticsPanel = ({ data, onBack }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableSearch, setTableSearch] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('Overview');

  // Helper for dynamic bar coloring based on temperature
  const getTempColorClass = (temp) => {
    if (temp >= 45) return 'bg-red-600';     // Extreme
    if (temp >= 40) return 'bg-red-500';     // Very Hot
    if (temp >= 35) return 'bg-orange-500';  // Hot
    if (temp >= 30) return 'bg-yellow-500';  // Warm
    if (temp >= 20) return 'bg-green-500';   // Pleasant/Mild
    return 'bg-blue-400';                    // Cool/Cold
  };

  // Process data for charts
  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;

    const sortedByTemp = [...data].sort((a, b) => (b.temp || 0) - (a.temp || 0));
    const sortedByHeatIndex = [...data].sort((a, b) => (b.heatIndexC || 0) - (a.heatIndexC || 0));
    const sortedByRisk = [...data].sort((a, b) => (b.heatWeight || 0) - (a.heatWeight || 0));

    // Stats
    const totalCities = data.length;
    const avgTemp = (data.reduce((acc, c) => acc + (c.temp || 0), 0) / (totalCities || 1)).toFixed(1);
    const extremeRiskCount = data.filter(c => (c.heatWeight || 0) >= 6).length + data.filter(c => c.riskLevel === 'extreme').length;

    return {
      topTemps: sortedByTemp.slice(0, 5).map(c => ({
        label: c.city || c.name,
        numericValue: c.temp,
        displayValue: `${c.temp}°C`
      })),
      topHeatIndex: sortedByHeatIndex.slice(0, 5).map(c => ({
        label: c.city || c.name,
        numericValue: c.heatIndexC,
        displayValue: `${c.heatIndexC}°C`
      })),
      riskDistribution: [
        { label: 'Extreme', count: data.filter(c => (c.heatWeight || 0) >= 6).length, color: 'bg-red-500' },
        { label: 'High', count: data.filter(c => (c.heatWeight || 0) >= 4 && (c.heatWeight || 0) < 6).length, color: 'bg-orange-500' },
        { label: 'Moderate', count: data.filter(c => (c.heatWeight || 0) >= 2 && (c.heatWeight || 0) < 4).length, color: 'bg-yellow-500' },
        { label: 'Safe', count: data.filter(c => (c.heatWeight || 0) < 2).length, color: 'bg-green-500' },
      ].map(d => ({
        label: d.label,
        numericValue: d.count,
        displayValue: `${d.count} Cities`,
        color: d.color
      })),
      summary: {
        totalCities,
        avgTemp,
        extremeRiskCount
      }
    };
  }, [data]);

  // Filtered data for table
  const filteredData = useMemo(() => {
    if (!tableSearch.trim()) return data || [];
    return (data || []).filter(item =>
      (item.city || item.name || '').toLowerCase().includes(tableSearch.toLowerCase())
    );
  }, [data, tableSearch]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [tableSearch]);

  const getHeatIndexColor = status => {
    switch (status) { // Make flexible for case sensitivity
      case 'Critical': case 'Extreme': return 'text-red-500';
      case 'High': case 'Dangerous': return 'text-orange-500';
      case 'Moderate': case 'Caution': return 'text-yellow-500';
      default: return 'text-green-500';
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-cream-50 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-500 hover:text-slate-700"
            >
              <ArrowLeft size={18} />
              <span className="font-medium">Back</span>
            </button>
          )}
          <div className="w-px h-6 bg-slate-200"></div>
          <h2 className="font-bold text-slate-800 text-lg">Statistical Overview</h2>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-6">

          {/* Left Column: Heatmap (Smaller, 4 cols) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <div className="relative h-[400px] bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-card">
              <div className="absolute inset-0">
                <HeatmapMap data={data || []} selectedCity={null} onCitySelect={() => { }} />
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-center pointer-events-none">
                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200 shadow-sm pointer-events-auto">
                  <span className="text-xs font-bold text-slate-600">Map View</span>
                </div>
              </div>
            </div>

            {/* Quick Stat (Moved from top overlay which might be cluttered) - Summary Card 1 */}
            {stats && (
              <StatCard
                title="Avg Temperature"
                value={`${stats.summary.avgTemp}°C`}
                subtext="National Average"
                icon={Thermometer}
                colorClass="bg-blue-500"
              />
            )}
          </div>

          {/* Right Column: Charts (Larger, 8 cols) */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats && (
                <>
                  <SimpleBarChart
                    title="Hottest Cities"
                    data={stats.topTemps}
                    getColor={getTempColorClass}
                  />
                  <SimpleBarChart
                    title="Heat Index Leaders"
                    data={stats.topHeatIndex}
                    getColor={getTempColorClass}
                  />
                </>
              )}
            </div>

            {/* Risk Distribution / Full Width Chart */}
            {stats && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card">
                <h3 className="font-bold text-slate-800 mb-6">Risk Level Distribution</h3>
                <div className="flex gap-4 items-end h-40 relative">
                  {/* Overlay message if safe (no extreme/high/moderate risks, mostly safe) */}
                  {/* Check if extreme and high counts are 0 */}
                  {stats.riskDistribution.slice(0, 2).reduce((sum, item) => sum + item.numericValue, 0) === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <div className="bg-green-50/95 backdrop-blur-[2px] px-6 py-3 rounded-2xl border border-green-100 flex items-center gap-3 shadow-sm animate-in fade-in zoom-in duration-300">
                        <CheckCircle2 size={24} className="text-green-500" />
                        <div>
                          <p className="font-bold text-green-700 text-sm">Safe Conditions</p>
                          <p className="text-green-600 text-xs font-medium">No high risk heatwaves detected</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {stats.riskDistribution.map((item, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group z-0">
                      <div className="text-xs font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.displayValue}
                      </div>
                      <div className="w-full bg-slate-50 rounded-xl relative h-full flex items-end overflow-hidden group-hover:bg-slate-100 transition-colors">
                        <div
                          className={`w-full ${item.color} rounded-t-xl transition-all duration-700 relative`}
                          style={{
                            height: `${item.numericValue === 0 ? 2 : (item.numericValue / stats.summary.totalCities) * 100}%`,
                            minHeight: item.numericValue > 0 ? '10%' : '4px',
                            opacity: item.numericValue === 0 ? 0.3 : 1
                          }}
                        />
                      </div>
                      <span className={`text-xs font-bold ${item.numericValue > 0 ? 'text-slate-600' : 'text-slate-300'} transition-colors`}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Data Table Section */}
        <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-bold text-slate-800">Detailed City Data</h3>

            {/* Search Input */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search in table..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full sm:w-64"
              />
              {tableSearch && (
                <button
                  onClick={() => setTableSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">City</th>
                  <th className="px-6 py-4">Temperature</th>
                  <th className="px-6 py-4">Rh (%)</th>
                  <th className="px-6 py-4">Heat Index</th>
                  <th className="px-6 py-4">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredData.slice((currentPage - 1) * 10, currentPage * 10).map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-700">{row.city || row.name}</td>
                    <td className="px-6 py-4 text-slate-600">{row.temp || row.tempC}°C</td>
                    <td className="px-6 py-4 text-slate-600">{row.rh}%</td>
                    <td className="px-6 py-4 font-semibold text-orange-600">{row.heatIndexC || row.heatIndex}°C</td>
                    <td className={`px-6 py-4 font-medium ${getHeatIndexColor(row.riskLevel || row.status)}`}>
                      {row.riskLevel || row.status || 'Normal'}
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                      No results found for "{tableSearch}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Simple Pagination */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 hidden sm:block">
              Showing {filteredData.length > 0 ? (currentPage - 1) * 10 + 1 : 0} to {Math.min(currentPage * 10, filteredData.length)} of {filteredData.length} entries
            </span>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-50"
              >
                <ChevronLeft size={20} className="text-slate-600" />
              </button>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage * 10 >= filteredData.length}
                className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-50"
              >
                <ChevronRight size={20} className="text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
