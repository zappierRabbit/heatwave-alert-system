// Generate heatmap points directly from city data
// Each point is [lat, lng, intensity] where intensity is normalized temperature

export const generateHeatmapPoints = (cities) => {
  if (!cities || cities.length === 0) return [];

  const minTemp = 10; // Lowered for cold Kashmir/Ladakh regions
  const maxTemp = 52;
  const tempRange = maxTemp - minTemp;

  const points = [];

  cities.forEach((city) => {
    // Use heatWeight directly if available (normalized 0-1), otherwise calculate from temp
    const intensity = city.heatWeight !== undefined
      ? Math.min(1, Math.max(0, city.heatWeight))
      : Math.min(1, Math.max(0, (city.temp - minTemp) / tempRange));

    // Add the city center point
    points.push([city.lat, city.lng, intensity]);

    // Add surrounding points for better coverage (smaller radius, fewer points)
    const surroundingRadius = 0.3;
    const numPoints = 6;

    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      const lat = city.lat + surroundingRadius * Math.cos(angle);
      const lng = city.lng + surroundingRadius * Math.sin(angle);
      // Slightly reduced intensity for surrounding points
      points.push([lat, lng, intensity * 0.85]);
    }
  });

  return points;
};
