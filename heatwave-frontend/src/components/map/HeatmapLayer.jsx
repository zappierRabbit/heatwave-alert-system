import { useEffect, useRef } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

export const HeatmapLayer = ({ points }) => {
  const map = useMap();
  const heatLayerRef = useRef(null);

  // Temperature gradient - green (cool) to red (hot)
  const gradient = {
    0.0: '#0d3d0d',  // Dark green
    0.12: '#1a5f1a',
    0.24: '#2d8a2d',
    0.36: '#4caf50',
    0.48: '#8bc34a',
    0.55: '#cddc39',
    0.62: '#ffeb3b',
    0.69: '#ffc107',
    0.76: '#ff9800',
    0.83: '#ff5722',
    0.9: '#f44336',
    1.0: '#b71c1c',  // Dark red
  };

  // Cluster points using projected coordinates (meters) for consistent distance
  const clusterPoints = (points, zoom) => {
    if (zoom >= 9) return points; // stop clustering when zoomed in

    const pixelGridSize = 60; // desired screen spacing in pixels
    const clusters = {};

    points.forEach(point => {
      const [lat, lng, intensity] = point;

      // Project lat/lng to point (meters)
      const projected = map.project([lat, lng], map.getZoom());
      const gridX = Math.floor(projected.x / pixelGridSize);
      const gridY = Math.floor(projected.y / pixelGridSize);
      const key = `${gridX},${gridY}`;

      if (!clusters[key]) {
        clusters[key] = { latSum: 0, lngSum: 0, intensitySum: 0, count: 0 };
      }

      clusters[key].latSum += lat;
      clusters[key].lngSum += lng;
      clusters[key].intensitySum += intensity;
      clusters[key].count += 1;
    });

    return Object.values(clusters).map(cluster => [
      cluster.latSum / cluster.count,
      cluster.lngSum / cluster.count,
      cluster.intensitySum / cluster.count
    ]);
  };

  const updateHeatLayer = () => {
    if (!points || points.length === 0) return;

    const currentZoom = map.getZoom();
    const displayPoints = clusterPoints(points, currentZoom);

    // Dynamically set radius to cover most of the map (~95%)
    const mapSize = map.getSize();
    const largerDimension = Math.max(mapSize.x, mapSize.y);

    // Radius proportional to map size
    const radius = Math.max(40, largerDimension / 15);  // tweak divisor for coverage
    const blur = radius * 0.6;

    const maxIntensity = Math.max(...displayPoints.map(p => p[2]), 1);

    if (!heatLayerRef.current) {
      heatLayerRef.current = L.heatLayer(displayPoints, {
        radius,
        blur,
        max: maxIntensity,
        minOpacity: 0.4,
        gradient,
      }).addTo(map);
    } else {
      heatLayerRef.current.setLatLngs(displayPoints);
      heatLayerRef.current.setOptions({ radius, blur, max: maxIntensity });
    }
  };


  // Update heatmap on zoom end
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
        heatLayerRef.current = null;
      }
    };
  }, [map, points]);

  return null;
};
