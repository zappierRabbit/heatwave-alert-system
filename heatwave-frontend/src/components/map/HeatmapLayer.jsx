import { useEffect, useRef } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

export const HeatmapLayer = ({ points }) => {
  const map = useMap();
  const heatLayerRef = useRef(null);

  // Temperature gradient - Blue (cool) -> Cyan -> Lime -> Yellow -> Red (hot)
  const gradient = {
    0.0: '#00008b',   // Dark Blue
    0.2: '#00bcd4',   // Cyan
    0.4: '#00ff00',   // Lime
    0.6: '#ffff00',   // Yellow
    0.8: '#ff8c00',   // Dark Orange
    1.0: '#ff0000',   // Red
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

    // Dynamic radius strategy:
    // If clustered (low zoom), keep radius comparable to grid size to avoid "blobs"
    // If zoomed in (raw points), maybe allow slightly larger for smooth blending
    const isClustered = currentZoom < 9;

    let radius, blur;

    if (isClustered) {
      // Grid is 60px. Radius of ~40-50 blends neighbors slightly without creating a massive blob.
      radius = 45;
      blur = 30;
    } else {
      // High zoom: standard logic or fixed appropriate size
      radius = 30;
      blur = 20;
    }

    const maxIntensity = Math.max(...displayPoints.map(p => p[2]), 1);

    if (!heatLayerRef.current) {
      heatLayerRef.current = L.heatLayer(displayPoints, {
        radius,
        blur,
        max: maxIntensity,
        minOpacity: 0.3, // Slightly lower min opacity for subtler cool areas
        gradient,
      }).addTo(map);
    } else {
      heatLayerRef.current.setLatLngs(displayPoints);
      heatLayerRef.current.setOptions({ radius, blur, max: maxIntensity, gradient, minOpacity: 0.3 });
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
