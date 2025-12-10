import React, { useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { HeatmapLayer } from './HeatmapLayer';
import { TemperatureLegend } from './TemperatureLegend';
import { generateHeatmapPoints } from '../../utils/heatmapGenerator';
import { getTemperatureColor } from '../../data/cities';

const MapController = ({ selectedCity }) => {
  const map = useMap();
  React.useEffect(() => {
    if (selectedCity) {
      map.flyTo([selectedCity.lat, selectedCity.lng], 10, {
        duration: 1.5,
      });
    }
  }, [selectedCity, map]);
  return null;
};

export const HeatmapMap = ({ data, onCitySelect, selectedCity }) => {
  // Memoize heatmap points to avoid recalculating on every render unless data changes
  const heatmapPoints = useMemo(() => generateHeatmapPoints(data), [data]);

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer
        center={[30.3753, 69.3451]}
        zoom={6}
        scrollWheelZoom={true}
        className="h-full w-full bg-slate-50"
        zoomControl={false}
        minZoom={5}
        maxZoom={12}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        />

        <HeatmapLayer points={heatmapPoints} />

        {/* City labels layer on top */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
          pane="overlayPane"
        />

        {/* City markers - using CircleMarker for cleaner look */}
        {data.map((city) => (
          <CircleMarker
            key={city.id}
            center={[city.lat, city.lng]}
            radius={8}
            pathOptions={{
              color: '#fff',
              weight: 2,
              fillColor: getTemperatureColor(city.temp),
              fillOpacity: 0.9,
            }}
            eventHandlers={{
              click: () => onCitySelect(city),
            }}
          >
            <Tooltip
              direction="top"
              offset={[0, -10]}
              opacity={1}
              permanent={false}
            >
              <div className="text-center px-1">
                <div className="font-bold text-slate-900">{city.name}</div>
                <div
                  className="font-mono font-semibold"
                  style={{ color: getTemperatureColor(city.temp) }}
                >
                  {city.temp}°C
                </div>
                {city.status !== 'Normal' && (
                  <div
                    className={`text-xs font-medium ${city.status === 'Critical' ? 'text-red-600' : 'text-amber-600'}`}
                  >
                    {city.status}
                  </div>
                )}
              </div>
            </Tooltip>
          </CircleMarker>
        ))}

        <MapController selectedCity={selectedCity} />
      </MapContainer>

      {/* Temperature Legend */}
      <TemperatureLegend />
    </div>
  );
};
