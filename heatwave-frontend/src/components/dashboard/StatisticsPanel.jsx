import React, { useState } from 'react';
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
} from 'lucide-react';
import { HeatmapMap } from '../map/HeatmapMap';

export const StatisticsPanel = ({ data, onBack }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMetric, setSelectedMetric] = useState('Impressions');

  // Sample data for the table - in real app, this would come from props/API
  const tableData = [
    { name: 'Karachi', temp: 42, humidity: 65, heatIndex: 'Critical', alerts: 12 },
    { name: 'Lahore', temp: 39, humidity: 58, heatIndex: 'High', alerts: 8 },
    { name: 'Islamabad', temp: 35, humidity: 52, heatIndex: 'Moderate', alerts: 3 },
    { name: 'Peshawar', temp: 41, humidity: 45, heatIndex: 'High', alerts: 6 },
    { name: 'Multan', temp: 44, humidity: 38, heatIndex: 'Critical', alerts: 15 },
  ];

  const getHeatIndexColor = status => {
    switch (status) {
      case 'Critical':
        return 'text-red-500';
      case 'High':
        return 'text-orange-500';
      case 'Moderate':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-cream-50 overflow-y-auto">
      {/* Header / Breadcrumbs */}
      <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-slate-100">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Back</span>
          </button>
          <div className="w-px h-6 bg-slate-200"></div>
          <h2 className="font-bold text-slate-800 text-lg">Heat Map</h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">Displaying</span>
            <button className="flex items-center gap-1 text-blue-500 font-medium hover:text-blue-600">
              Pakistan
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">Show on map</span>
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium flex items-center gap-2 shadow-sm cursor-pointer hover:border-slate-300 transition-colors">
            {selectedMetric}
            <ChevronDown size={14} className="text-slate-400" />
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="p-6">
        <div className="relative h-[450px] bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-card">
          {/* Map */}
          <div className="absolute inset-0">
            <HeatmapMap data={data || []} selectedCity={null} onCitySelect={() => {}} />
          </div>

          {/* Map Controls Overlay */}
          <div className="absolute top-4 left-4 bg-white p-2.5 rounded-xl shadow-soft border border-slate-100 cursor-pointer hover:shadow-md transition-shadow">
            <Expand size={18} className="text-slate-500" />
          </div>

          {/* Share Button */}
          <div className="absolute bottom-5 left-5">
            <button
              onClick={() => setShowShareModal(true)}
              className="bg-white text-slate-700 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-soft hover:shadow-md transition-all flex items-center gap-2 border border-slate-100"
            >
              <Share2 size={16} className="text-primary-500" />
              Share the Map
            </button>
          </div>

          {/* Share Modal */}
          {showShareModal && (
            <div className="absolute top-1/2 right-6 -translate-y-1/2 bg-white rounded-3xl shadow-xl border border-slate-100 p-6 w-96 z-20 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-blue-500">Heat map Share</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={18} className="text-slate-400" />
                </button>
              </div>

              {/* Link Input */}
              <div className="mb-5">
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-2 tracking-wide">
                  Generated link to your heatmap
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value="https://heatwatch.pk/map/share/abc123"
                    className="flex-1 bg-primary-50/50 border border-primary-100 rounded-xl px-3 py-2.5 text-sm text-blue-500 font-medium focus:outline-none"
                  />
                  <button className="px-4 py-2.5 bg-white border-2 border-primary-400 text-primary-600 text-sm font-bold uppercase rounded-xl hover:bg-primary-50 transition-colors">
                    Copy
                  </button>
                </div>
              </div>

              {/* Filters Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-slate-700 font-semibold border-b border-slate-100 pb-2">
                  <span>Map Filters</span>
                  <ChevronDown size={16} className="text-blue-500" />
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase mb-1">
                      Region
                    </div>
                    <div className="text-sm font-medium text-blue-500">Pakistan - All Provinces</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase mb-1">
                      Data Range
                    </div>
                    <div className="text-sm font-medium text-blue-500">Last 24 Hours</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase mb-2">
                    Active Alerts:
                  </div>
                  <ul className="space-y-2">
                    {['Critical Heat Warning - Sindh', 'High Temperature Alert - Punjab', 'Heat Advisory - Balochistan'].map(
                      (item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                            <CheckCircle2 size={12} className="text-primary-500" />
                          </div>
                          <span className="text-slate-600">{item}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>

              {/* Success Icon */}
              <div className="absolute top-1/2 -left-14 -translate-y-1/2 bg-white p-3 rounded-2xl shadow-lg border border-slate-100">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={22} className="text-green-500" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section - Data Table */}
      <div className="px-6 pb-8">
        <div className="flex items-center gap-4 mb-4">
          <h3 className="text-lg font-bold text-slate-800">City Data</h3>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium shadow-sm cursor-pointer hover:border-slate-300 transition-colors">
            <span className="text-slate-500">Date:</span>
            <span className="text-slate-700">Today</span>
            <span className="text-slate-300 mx-1">|</span>
            <span className="text-blue-500">Pakistan</span>
            <ChevronDown size={14} className="text-slate-400 ml-1" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">City</th>
                <th className="px-6 py-4">Temperature</th>
                <th className="px-6 py-4">Humidity</th>
                <th className="px-6 py-4">Heat Index</th>
                <th className="px-6 py-4">Alerts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tableData.map((row, i) => (
                <tr
                  key={i}
                  className="hover:bg-blue-50/30 transition-colors text-slate-600 font-medium"
                >
                  <td className="px-6 py-4 text-blue-500 font-semibold">{row.name}</td>
                  <td className="px-6 py-4">{row.temp}°C</td>
                  <td className="px-6 py-4">{row.humidity}%</td>
                  <td className={`px-6 py-4 font-semibold ${getHeatIndexColor(row.heatIndex)}`}>
                    {row.heatIndex}
                  </td>
                  <td className="px-6 py-4">{row.alerts}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
            <span>Showing 1 to 5 of {data?.length || 0} entries</span>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-40">
                <ChevronLeft size={16} />
              </button>
              <div className="flex gap-1">
                {[1, 2, 3].map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-slate-800 text-white'
                        : 'hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
