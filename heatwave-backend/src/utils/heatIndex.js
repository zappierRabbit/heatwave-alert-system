// src/utils/heatIndex.js

function cToF(c) {
  return c * 9 / 5 + 32;
}

function fToC(f) {
  return (f - 32) * 5 / 9;
}

/**
 * computeHeatIndexC(tempC, rh)
 * tempC: temperature in °C
 * rh: relative humidity in %
 * returns: heat index in °C (approx)
 */
function computeHeatIndexC(tempC, rh) {
  const T = cToF(tempC);
  const R = rh;

  // If temp < 26°C (~78.8°F), HI ≈ T (no huge extra risk)
  if (T < 80 || R < 40) {
    return tempC;
  }

  // Rothfusz regression (NOAA)
  let HI =
    -42.379 +
    2.04901523 * T +
    10.14333127 * R -
    0.22475541 * T * R -
    0.00683783 * T * T -
    0.05481717 * R * R +
    0.00122874 * T * T * R +
    0.00085282 * T * R * R -
    0.00000199 * T * T * R * R;

  // Optional small adjustments (simplified)
  // High temp + low humidity
  if (R < 13 && T >= 80 && T <= 112) {
    HI -= ((13 - R) / 4) * Math.sqrt((17 - Math.abs(T - 95)) / 17);
  }
  // High humidity
  if (R > 85 && T >= 80 && T <= 87) {
    HI += ((R - 85) / 10) * ((87 - T) / 5);
  }

  const HIC = fToC(HI);
  return Math.round(HIC * 10) / 10;
}

/**
 * classifyHeatRisk(heatIndexC)
 * returns: 'none' | 'caution' | 'extreme_caution' | 'danger' | 'extreme_danger'
 */
function classifyHeatRisk(heatIndexC) {
  if (heatIndexC < 27) return 'none';            // < 80°F
  if (heatIndexC < 32) return 'caution';         // 80–90°F
  if (heatIndexC < 39) return 'extreme_caution'; // 90–103°F
  if (heatIndexC < 51) return 'danger';          // 103–124°F
  return 'extreme_danger';                       // 125°F+
}

module.exports = {
  computeHeatIndexC,
  classifyHeatRisk
};
