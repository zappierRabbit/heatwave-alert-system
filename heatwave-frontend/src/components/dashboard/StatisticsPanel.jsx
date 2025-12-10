import React, { useState, useMemo } from 'react';
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
  Wind
} from 'lucide-react';
import { HeatmapMap } from '../map/HeatmapMap';

const SimpleBarChart = ({ title, data, colorClass = "bg-blue-500", valueLabel = "value" }) => {
  const maxValue = Math.max(...data.map(d => parseFloat(d.numericValue) || 0), 10);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card flex flex-col h-full">
      <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
        {title}
      </h3>
      <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {data.map((item, i) => (
          <div key={i} className="group">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-600 truncate max-w-[120px]" title={item.label}>
                {item.label}
              </span>
              <span className="font-bold text-slate-800">{item.displayValue}</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${colorClass} transition-all duration-500 group-hover:opacity-80`}
                style={{ width: `${Math.min(100, (parseFloat(item.numericValue) / maxValue) * 100)}%` }}
              />
            </div>
          </div>
        ))}
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
  const [selectedMetric, setSelectedMetric] = useState('Overview');

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
        { label: 'Low/Safe', count: data.filter(c => (c.heatWeight || 0) < 2).length, color: 'bg-green-500' },
      ].filter(d => d.count > 0).map(d => ({
        label: d.label,
        numericValue: d.count,
        displayValue: `${d.count} Cities`
      })),
      summary: {
        totalCities,
        avgTemp,
        extremeRiskCount
      }
    };
  }, [data]);

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
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Back</span>
          </button>
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
                    colorClass="bg-red-500"
                  />
                  <SimpleBarChart
                    title="Heat Index Leaders"
                    data={stats.topHeatIndex}
                    colorClass="bg-orange-500"
                  />
                </>
              )}
            </div>

            {/* Risk Distribution / Full Width Chart */}
            {stats && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card">
                <h3 className="font-bold text-slate-800 mb-6">Risk Level Distribution</h3>
                <div className="flex gap-4 items-end h-40">
                  {stats.riskDistribution.map((item, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="text-xs font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.displayValue}
                      </div>
                      <div className="w-full bg-slate-50 rounded-xl relative h-full flex items-end overflow-hidden">
                        <div
                          className={`w-full ${item.label === 'Extreme' ? 'bg-red-500' : item.label === 'High' ? 'bg-orange-500' : item.label === 'Moderate' ? 'bg-yellow-500' : 'bg-green-500'} rounded-t-xl transition-all duration-700`}
                          style={{ height: `${(item.numericValue / stats.summary.totalCities) * 100}%`, minHeight: '10%' }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-600">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Data Table Section */}
        <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Detailed City Data</h3>
            <div className="text-sm text-slate-500">
              Showing top entries
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
                {(data || []).slice((currentPage - 1) * 10, currentPage * 10).map((row, i) => (
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
              </tbody>
            </table>
          </div>
          {/* Simple Pagination */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-50"
            >
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            <span className="text-sm font-medium text-slate-600">Page {currentPage}</span>
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage * 10 >= (data?.length || 0)}
              className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-50"
            >
              <ChevronRight size={20} className="text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
