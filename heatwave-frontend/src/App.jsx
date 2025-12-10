import { useState } from 'react';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { HeatmapMap } from './components/map/HeatmapMap';
import { CityDetailPanel } from './components/dashboard/CityDetailPanel';
import { useHeatwaveData } from './hooks/useHeatwaveData';
import { AlertCircle } from 'lucide-react';

function App() {
  const [selectedCity, setSelectedCity] = useState(null);
  const data = useHeatwaveData();

  // Calculate quick stats
  const criticalCount = data.filter(c => c.status === 'Critical').length;
  const avgTemp = (data.reduce((acc, curr) => acc + curr.temp, 0) / (data.length || 1)).toFixed(1);

  return (
    <DashboardLayout>
      {/* Top Overlay Stats */}
      <div className="absolute top-4 left-4 z-[400] flex gap-4 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-md border border-slate-200 p-4 rounded-xl pointer-events-auto shadow-sm">
          <h3 className="text-slate-500 text-xs font-semibold uppercase">National Avg</h3>
          <div className="text-2xl font-mono font-bold text-slate-900">{avgTemp}°C</div>
        </div>

        {criticalCount > 0 && (
          <div className="bg-red-50 backdrop-blur-md border border-red-200 p-4 rounded-xl pointer-events-auto flex items-center gap-3 animate-pulse">
            <AlertCircle className="text-red-600" />
            <div>
              <h3 className="text-red-600 text-xs font-semibold uppercase">Critical Alerts</h3>
              <div className="text-2xl font-mono font-bold text-red-600">{criticalCount} Cities</div>
            </div>
          </div>
        )}
      </div>

      <HeatmapMap
        data={data}
        onCitySelect={setSelectedCity}
        selectedCity={selectedCity}
      />

      <CityDetailPanel
        city={selectedCity}
        onClose={() => setSelectedCity(null)}
      />
    </DashboardLayout>
  );
}

export default App;
