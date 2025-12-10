import { useEffect, useRef, useMemo } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

export const HeatmapLayer = ({ points }) => {
  const map = useMap();
  const heatLayerRef = useRef(null);

  // Memoize gradient to prevent unnecessary recalculations
  const gradient = useMemo(() => ({
    0.0: '#0d3d0d',   // Very dark green (10-15°C)
    0.12: '#1a5f1a',  // Dark green (15-20°C)
    0.24: '#2d8a2d',  // Green (20-25°C)
    0.36: '#4caf50',  // Light green (25-30°C)
    0.48: '#8bc34a',  // Lime (30-35°C)
    0.55: '#cddc39',  // Yellow-green (35-38°C)
    0.62: '#ffeb3b',  // Yellow (38-40°C)
    0.69: '#ffc107',  // Amber (40-42°C)
    0.76: '#ff9800',  // Orange (42-44°C)
    0.83: '#ff5722',  // Deep orange (44-46°C)
    0.9: '#f44336',   // Red (46-48°C)
    1.0: '#b71c1c',   // Dark red (48-52°C)
  }), []);

  // Improved clustering with zoom-adaptive behavior
  const clusterPoints = useMemo(() => {
    if (!points || points.length === 0) return [];

    const currentZoom = map.getZoom();

    // For high zoom levels, don't cluster
    if (currentZoom >= 12) return points;

    // Adjust clustering density based on zoom level
    const pixelGridSize = 40 + (currentZoom * 2); // Smaller grid at higher zoom
    const zoomFactor = Math.max(1, 15 - currentZoom); // More aggressive clustering at lower zoom

    // Convert to screen coordinates for accurate pixel-based clustering
    const projectPoint = (lat, lng) => {
      const point = map.latLngToContainerPoint([lat, lng]);
      return { x: point.x, y: point.y };
    };

    const clusters = new Map();

    points.forEach(point => {
      const [lat, lng, intensity] = point;
      const screenPoint = projectPoint(lat, lng);

      // Create grid cell key based on screen coordinates
      const gridX = Math.floor(screenPoint.x / pixelGridSize);
      const gridY = Math.floor(screenPoint.y / pixelGridSize);
      const key = `${gridX},${gridY}`;

      if (!clusters.has(key)) {
        clusters.set(key, {
          latSum: 0,
          lngSum: 0,
          intensitySum: 0,
          maxIntensity: 0, // Track maximum intensity
          count: 0,
          screenX: screenPoint.x,
          screenY: screenPoint.y
        });
      }

      const cluster = clusters.get(key);
      cluster.latSum += lat;
      cluster.lngSum += lng;
      cluster.intensitySum += intensity;
      cluster.maxIntensity = Math.max(cluster.maxIntensity, intensity);
      cluster.count += 1;

      // Update screen position to be average of all points
      cluster.screenX = (cluster.screenX * (cluster.count - 1) + screenPoint.x) / cluster.count;
      cluster.screenY = (cluster.screenY * (cluster.count - 1) + screenPoint.y) / cluster.count;
    });

    // Convert clusters back to points
    const result = [];

    clusters.forEach(cluster => {
      if (cluster.count > 0) {
        // Use weighted average that preserves intensity distribution
        // Options: average, max, or weighted average
        const avgLat = cluster.latSum / cluster.count;
        const avgLng = cluster.lngSum / cluster.count;

        // Choose intensity method based on use case:
        // 1. Use maximum intensity to preserve hotspots
        // const clusterIntensity = cluster.maxIntensity;

        // 2. Use average intensity (current approach)
        const clusterIntensity = cluster.intensitySum / cluster.count;

        // 3. Use weighted average (more points = higher intensity)
        // const clusterIntensity = (cluster.intensitySum / cluster.count) * Math.min(cluster.count / 5, 1);

        // Only add cluster if it has reasonable intensity
        if (clusterIntensity > 0.01) { // Threshold to filter noise
          result.push([avgLat, avgLng, clusterIntensity]);
        }
      }
    });

    return result;
  }, [points, map]);

  // Calculate optimal radius and blur based on zoom level
  const getHeatmapConfig = useMemo(() => {
    const zoom = map.getZoom();

    // Radius and blur should decrease as we zoom in
    let radius = 40;
    let blur = 25;

    if (zoom >= 12) {
      // Very zoomed in - small, precise circles
      radius = 15;
      blur = 10;
    } else if (zoom >= 9) {
      // Medium zoom
      radius = 25;
      blur = 15;
    } else if (zoom >= 6) {
      // Lower zoom
      radius = 35;
      blur = 20;
    } else {
      // Very zoomed out
      radius = 50;
      blur = 30;
    }

    return { radius, blur };
  }, [map]);

  // Update heat layer function
  const updateHeatLayer = useMemo(() => {
    return () => {
      if (!points || points.length === 0) {
        if (heatLayerRef.current) {
          map.removeLayer(heatLayerRef.current);
          heatLayerRef.current = null;
        }
        return;
      }

      const size = map.getSize();
      if (size.x === 0 || size.y === 0) return;

      // Remove existing layer
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
      }

      const { radius, blur } = getHeatmapConfig;

      // Use clustered points if clustering is active
      const displayPoints = clusterPoints.length > 0 ? clusterPoints : points;

      // Find intensity range for better visualization
      const intensities = displayPoints.map(p => p[2]);
      const maxIntensity = Math.max(...intensities);
      const minIntensity = Math.min(...intensities);

      // Normalize intensities if needed
      const normalizedPoints = maxIntensity > 1 ?
        displayPoints.map(p => [p[0], p[1], p[2] / maxIntensity]) :
        displayPoints;

      // Create heat layer with zoom-adaptive settings
      heatLayerRef.current = L.heatLayer(normalizedPoints, {
        radius: radius,
        blur: blur,
        maxZoom: 18, // Increased max zoom
        minOpacity: 0.3, // Slightly lower for better visibility
        max: 1.0,
        gradient: gradient,
        // Add performance optimizations
        pane: 'overlayPane',
      }).addTo(map);

      // Debug info (optional)
      console.log(`Heatmap updated: ${displayPoints.length} points, zoom: ${map.getZoom()}, radius: ${radius}`);
    };
  }, [map, points, clusterPoints, gradient, getHeatmapConfig]);

  // Set up map event listeners
  useMapEvents({
    zoomend: updateHeatLayer,
    moveend: updateHeatLayer,
    resize: updateHeatLayer,
  });

  // Initial render and cleanup
  useEffect(() => {
    // Small delay to ensure map is fully initialized
    const timer = setTimeout(updateHeatLayer, 100);

    return () => {
      clearTimeout(timer);
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
    };
  }, [updateHeatLayer, map]);

  return null;
};