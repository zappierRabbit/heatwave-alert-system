import { useState } from 'react';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { HeatmapMap } from './components/map/HeatmapMap';
import { CityDetailPanel } from './components/dashboard/CityDetailPanel';
import { StatisticsPanel } from './components/dashboard/StatisticsPanel';
import { SOPsPanel } from './components/dashboard/SOPsPanel';
import { AlertsPanel } from './components/alerts/AlertsPanel';
import { HistoricalWeatherChart } from './components/dashboard/HistoricalWeatherChart';
import { useHeatwaveData } from './hooks/useHeatwaveData';
import { Thermometer, TrendingUp, MapPin } from 'lucide-react';

function App() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const data = useHeatwaveData();

  // Calculate quick stats
  const avgTemp = (data.reduce((acc, curr) => acc + curr.temp, 0) / (data.length || 1)).toFixed(1);
  const maxTemp = data.length > 0 ? Math.max(...data.map(c => c.temp)).toFixed(1) : '0';

  const handleSearch = (query) => {
    if (!query) return;
    const city = data.find((c) => c.name.toLowerCase().includes(query.toLowerCase()));
    if (city) {
      setSelectedCity(city);
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab} onSearch={handleSearch} data={data}>
      {activeTab === 'dashboard' ? (
        <StatisticsPanel data={data} />
      ) : activeTab === 'heatmap' ? (
        <>
          {/* Stats Overlay */}
          <div className="absolute top-4 left-4 z-[400] pointer-events-none">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm pointer-events-auto overflow-hidden">
              <div className="flex divide-x divide-slate-200">
                {/* National Average */}
                <div className="flex items-center gap-3 px-5 py-4">
                  <Thermometer size={20} className="text-slate-400" strokeWidth={1.5} />
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                      National Avg
                    </div>
                    <div className="text-lg font-bold text-slate-800">{avgTemp}°C</div>
                  </div>
                </div>

                {/* Max Temperature */}
                <div className="flex items-center gap-3 px-5 py-4">
                  <TrendingUp size={20} className="text-slate-400" strokeWidth={1.5} />
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                      Max Temp
                    </div>
                    <div className="text-lg font-bold text-slate-800">{maxTemp}°C</div>
                  </div>
                </div>

                {/* Cities Count */}
                <div className="flex items-center gap-3 px-5 py-4">
                  <MapPin size={20} className="text-slate-400" strokeWidth={1.5} />
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                      Cities
                    </div>
                    <div className="text-lg font-bold text-slate-800">{data.length}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <HeatmapMap data={data} onCitySelect={setSelectedCity} selectedCity={selectedCity} />

          <CityDetailPanel city={selectedCity} onClose={() => setSelectedCity(null)} />
        </>
      ) : activeTab === 'sops' ? (
        <SOPsPanel />
      ) : activeTab === 'alerts' ? (
        <AlertsPanel onBack={() => setActiveTab('dashboard')} />
      ) : activeTab === 'historical' ? (
        <HistoricalWeatherChart />
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4 bg-slate-50">
          <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center">
            <MapPin size={28} className="text-slate-300" />
          </div>
          <p className="text-lg font-medium text-slate-500">Coming Soon</p>
          <p className="text-sm text-slate-400">This feature is under development</p>
        </div>
      )}
    </DashboardLayout>
  );
}

export default App;
