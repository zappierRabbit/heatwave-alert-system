import { useEffect, useRef } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

export const HeatmapLayer = ({ points }) => {
  const map = useMap();
  const heatLayerRef = useRef(null);

  // Temperature gradient - green (cool) to red (hot)
  const gradient = {
    0.0: '#1a5f1a', // Dark green (15-20°C)
    0.15: '#2d8a2d', // Green (20-25°C)
    0.28: '#4caf50', // Light green (25-30°C)
    0.4: '#8bc34a', // Lime (30-35°C)
    0.5: '#cddc39', // Yellow-green (35-38°C)
    0.58: '#ffeb3b', // Yellow (38-40°C)
    0.65: '#ffc107', // Amber (40-42°C)
    0.72: '#ff9800', // Orange (42-44°C)
    0.8: '#ff5722', // Deep orange (44-46°C)
    0.9: '#f44336', // Red (46-48°C)
    1.0: '#b71c1c', // Dark red (48-52°C)
  };

  const updateHeatLayer = () => {
    if (!points || points.length === 0) return;

    // Remove existing layer
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
    }

    // Create heat layer - simpler config like CodeSandbox example
    heatLayerRef.current = L.heatLayer(points, {
      radius: 35,
      blur: 25,
      maxZoom: 10,
      max: 1.0,
      minOpacity: 0.5,
      gradient: gradient,
    }).addTo(map);
  };

  // Update on zoom change
  useMapEvents({
    zoomend: () => {
      updateHeatLayer();
    },
  });

  // Initial render and update when points change
  useEffect(() => {
    updateHeatLayer();

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
      }
    };
  }, [map, points]);

  return null;
};
