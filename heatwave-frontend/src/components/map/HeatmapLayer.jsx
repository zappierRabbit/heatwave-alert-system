import { useEffect, useRef } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

export const HeatmapLayer = ({ points }) => {
  const map = useMap();
  const heatLayerRef = useRef(null);

  // Temperature gradient - green (cool) to red (hot)
  // Range: 10°C to 52°C
  const gradient = {
    0.0: '#0d3d0d', // Very dark green (10-15°C)
    0.12: '#1a5f1a', // Dark green (15-20°C)
    0.24: '#2d8a2d', // Green (20-25°C)
    0.36: '#4caf50', // Light green (25-30°C)
    0.48: '#8bc34a', // Lime (30-35°C)
    0.55: '#cddc39', // Yellow-green (35-38°C)
    0.62: '#ffeb3b', // Yellow (38-40°C)
    0.69: '#ffc107', // Amber (40-42°C)
    0.76: '#ff9800', // Orange (42-44°C)
    0.83: '#ff5722', // Deep orange (44-46°C)
    0.9: '#f44336', // Red (46-48°C)
    1.0: '#b71c1c', // Dark red (48-52°C)
  };

  // Pixel-based clustering to ensure constant screen density
  // This prevents points from getting too close and "stacking" intensities
  const clusterPoints = (points, zoom) => {
    // If we are zoomed in enough (city level), stop clustering
    if (zoom >= 9) return points;

    // We want points to be roughly 60 pixels apart on screen
    const pixelGridSize = 60;

    // Calculate how many degrees represent those pixels at current zoom
    // Formula: 360 degrees / (256px tile * 2^zoom) = degrees per pixel
    const degreesPerPixel = 360 / (256 * Math.pow(2, zoom));
    const gridSize = pixelGridSize * degreesPerPixel;

    const clusters = {};

    points.forEach(point => {
      const [lat, lng, intensity] = point;

      // Calculate grid cell keys
      const gridX = Math.floor(lat / gridSize);
      const gridY = Math.floor(lng / gridSize);
      const key = `${gridX},${gridY}`;

      if (!clusters[key]) {
        clusters[key] = {
          latSum: 0,
          lngSum: 0,
          intensitySum: 0,
          weightSum: 0, // Use weight to prioritize hotter spots slightly if needed, or just average
          count: 0
        };
      }

      clusters[key].latSum += lat;
      clusters[key].lngSum += lng;
      clusters[key].intensitySum += intensity;
      clusters[key].count += 1;
    });

    // Convert clusters back to points
    return Object.values(clusters).map(cluster => [
      cluster.latSum / cluster.count,
      cluster.lngSum / cluster.count,
      cluster.intensitySum / cluster.count // Strict Average
    ]);
  };

  const updateHeatLayer = () => {
    if (!points || points.length === 0) return;

    const size = map.getSize();
    if (size.x === 0 || size.y === 0) return;

    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
    }

    const currentZoom = map.getZoom();
    const displayPoints = clusterPoints(points, currentZoom);

    // Since we control density (points are ~60px apart), 
    // we can use a fixed radius effectively.
    // Radius 40px ensures they touch (40+40 > 60) but don't stack deep.
    const radius = 40;
    const blur = 25; // Smooth gradients

    heatLayerRef.current = L.heatLayer(displayPoints, {
      radius: radius,
      blur: blur,
      maxZoom: 10,
      max: 1.0,
      minOpacity: 0.4,
      gradient: gradient,
    }).addTo(map);
  };

  // Update on zoom change
  useMapEvents({
    zoomend: () => {
      updateHeatLayer();
    },
    // Also update on move to handle edge cases if needed, 
    // though for simple clustering zoomend is usually enough
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
