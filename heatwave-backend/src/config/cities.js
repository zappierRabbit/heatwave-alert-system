// src/config/cities.js
// Pakistan city list + synthetic points for dense heatmap coverage

// ---------------- BASE REAL CITIES ----------------

const BASE_CITIES = [
  // --- Federal / Capital ---
  { id: 'islamabad', name: 'Islamabad', lat: 33.6844, lon: 73.0479, type: 'plain' },

  // --- Sindh major & medium ---
  { id: 'karachi', name: 'Karachi', lat: 24.8607, lon: 67.0011, type: 'plain' },
  { id: 'hyderabad', name: 'Hyderabad', lat: 25.3960, lon: 68.3578, type: 'plain' },
  { id: 'sukkur', name: 'Sukkur', lat: 27.7052, lon: 68.8574, type: 'plain' },
  { id: 'larkana', name: 'Larkana', lat: 27.5616, lon: 68.2067, type: 'plain' },
  { id: 'mirpurkhas', name: 'Mirpur Khas', lat: 25.5269, lon: 69.0111, type: 'plain' },
  { id: 'nawabshah', name: 'Nawabshah', lat: 26.2483, lon: 68.4096, type: 'plain' },
  { id: 'badin', name: 'Badin', lat: 24.6500, lon: 68.8333, type: 'plain' },
  { id: 'thatta', name: 'Thatta', lat: 24.7475, lon: 67.9240, type: 'plain' },
  { id: 'dadu', name: 'Dadu', lat: 26.7319, lon: 67.7750, type: 'plain' },
  { id: 'shikarpur', name: 'Shikarpur', lat: 27.9556, lon: 68.6382, type: 'plain' },
  { id: 'jacobabad', name: 'Jacobabad', lat: 28.2819, lon: 68.4370, type: 'plain' },
  { id: 'ghotki', name: 'Ghotki', lat: 28.0044, lon: 69.3150, type: 'plain' },
  { id: 'kandhkot', name: 'Kandhkot', lat: 28.4000, lon: 69.3000, type: 'plain' },
  { id: 'khairpur', name: 'Khairpur', lat: 27.5294, lon: 68.7592, type: 'plain' },
  { id: 'matli', name: 'Matli', lat: 25.0411, lon: 68.6539, type: 'plain' },
  { id: 'kotri', name: 'Kotri', lat: 25.3650, lon: 68.3083, type: 'plain' },
  { id: 'hala', name: 'Hala', lat: 25.8103, lon: 68.4214, type: 'plain' },
  { id: 'mithi', name: 'Mithi (Thar)', lat: 24.7397, lon: 69.8000, type: 'plain' },
  { id: 'umarkot', name: 'Umarkot', lat: 25.3616, lon: 69.7364, type: 'plain' },
  { id: 'tando-adam', name: 'Tando Adam', lat: 25.7682, lon: 68.6619, type: 'plain' },
  { id: 'tando-allahyar', name: 'Tando Allahyar', lat: 25.4600, lon: 68.7167, type: 'plain' },
  { id: 'tando-muhammad-khan', name: 'Tando Muhammad Khan', lat: 25.1231, lon: 68.5386, type: 'plain' },

  // --- Punjab major ---
  { id: 'lahore', name: 'Lahore', lat: 31.5204, lon: 74.3587, type: 'plain' },
  { id: 'faisalabad', name: 'Faisalabad', lat: 31.4504, lon: 73.1350, type: 'plain' },
  { id: 'rawalpindi', name: 'Rawalpindi', lat: 33.5651, lon: 73.0169, type: 'plain' },
  { id: 'multan', name: 'Multan', lat: 30.1575, lon: 71.5249, type: 'plain' },
  { id: 'gujranwala', name: 'Gujranwala', lat: 32.1877, lon: 74.1945, type: 'plain' },
  { id: 'sialkot', name: 'Sialkot', lat: 32.4927, lon: 74.5319, type: 'plain' },
  { id: 'bahawalpur', name: 'Bahawalpur', lat: 29.3956, lon: 71.6836, type: 'plain' },
  { id: 'sargodha', name: 'Sargodha', lat: 32.0836, lon: 72.6711, type: 'plain' },
  { id: 'rahim-yar-khan', name: 'Rahim Yar Khan', lat: 28.4202, lon: 70.2952, type: 'plain' },
  { id: 'dg-khan', name: 'Dera Ghazi Khan', lat: 30.0450, lon: 70.6400, type: 'plain' },
  { id: 'mianwali', name: 'Mianwali', lat: 32.5853, lon: 71.5436, type: 'plain' },
  { id: 'jhang', name: 'Jhang', lat: 31.2681, lon: 72.3175, type: 'plain' },
  { id: 'sheikhupura', name: 'Sheikhupura', lat: 31.7131, lon: 73.9783, type: 'plain' },

  // --- Punjab medium / smaller ---
  { id: 'kasur', name: 'Kasur', lat: 31.1167, lon: 74.4500, type: 'plain' },
  { id: 'okara', name: 'Okara', lat: 30.8100, lon: 73.4500, type: 'plain' },
  { id: 'sahiwal', name: 'Sahiwal', lat: 30.6700, lon: 73.1000, type: 'plain' },
  { id: 'vehari', name: 'Vehari', lat: 30.0333, lon: 72.3500, type: 'plain' },
  { id: 'pakpattan', name: 'Pakpattan', lat: 30.3500, lon: 73.3833, type: 'plain' },
  { id: 'bahawalnagar', name: 'Bahawalnagar', lat: 29.9846, lon: 73.2428, type: 'plain' },
  { id: 'lodhran', name: 'Lodhran', lat: 29.5417, lon: 71.6333, type: 'plain' },
  { id: 'muzaffargarh', name: 'Muzaffargarh', lat: 30.0703, lon: 71.1933, type: 'plain' },
  { id: 'layyah', name: 'Layyah', lat: 30.9646, lon: 70.9444, type: 'plain' },
  { id: 'bhakkar', name: 'Bhakkar', lat: 31.6333, lon: 71.0667, type: 'plain' },
  { id: 'taunsa', name: 'Taunsa', lat: 30.7036, lon: 70.6500, type: 'plain' },
  { id: 'hafizabad', name: 'Hafizabad', lat: 32.0709, lon: 73.6858, type: 'plain' },
  { id: 'narowal', name: 'Narowal', lat: 32.1000, lon: 74.8833, type: 'plain' },
  { id: 'gujrat', name: 'Gujrat', lat: 32.5742, lon: 74.0762, type: 'plain' },
  { id: 'mandi-bahauddin', name: 'Mandi Bahauddin', lat: 32.5833, lon: 73.5000, type: 'plain' },
  { id: 'attock', name: 'Attock', lat: 33.7667, lon: 72.3667, type: 'plain' },
  { id: 'chakwal', name: 'Chakwal', lat: 32.9300, lon: 72.8550, type: 'plain' },
  { id: 'jhelum', name: 'Jhelum', lat: 32.9337, lon: 73.7303, type: 'plain' },
  { id: 'khanewal', name: 'Khanewal', lat: 30.3017, lon: 71.9321, type: 'plain' },
  { id: 'toba-tek-singh', name: 'Toba Tek Singh', lat: 30.9667, lon: 72.4833, type: 'plain' },
  { id: 'chichawatni', name: 'Chichawatni', lat: 30.5300, lon: 72.6900, type: 'plain' },
  { id: 'chiniot', name: 'Chiniot', lat: 31.7200, lon: 72.9789, type: 'plain' },
  { id: 'sadiqabad', name: 'Sadiqabad', lat: 28.3062, lon: 70.1307, type: 'plain' },
  { id: 'haroonabad', name: 'Haroonabad', lat: 29.6100, lon: 73.1300, type: 'plain' },
  { id: 'hujra-shah-muqeem', name: 'Hujra Shah Muqeem', lat: 30.7400, lon: 73.8100, type: 'plain' },

  // --- Khyber Pakhtunkhwa major ---
  { id: 'peshawar', name: 'Peshawar', lat: 34.0151, lon: 71.5249, type: 'plain' },
  { id: 'mardan', name: 'Mardan', lat: 34.1954, lon: 72.0447, type: 'plain' },
  { id: 'charsadda', name: 'Charsadda', lat: 34.1453, lon: 71.7308, type: 'plain' },
  { id: 'kohat', name: 'Kohat', lat: 33.5869, lon: 71.4414, type: 'plain' },
  { id: 'bannu', name: 'Bannu', lat: 32.9853, lon: 70.6047, type: 'plain' },
  { id: 'dera-ismail-khan', name: 'Dera Ismail Khan', lat: 31.8327, lon: 70.9024, type: 'plain' },
  { id: 'swabi', name: 'Swabi', lat: 34.1199, lon: 72.4699, type: 'plain' },
  { id: 'nowshera', name: 'Nowshera', lat: 34.0153, lon: 71.9812, type: 'plain' },
  { id: 'hangu', name: 'Hangu', lat: 33.5281, lon: 71.0592, type: 'plain' },
  { id: 'karak', name: 'Karak', lat: 33.1167, lon: 71.0833, type: 'plain' },

  // --- KPK hilly / northern ---
  { id: 'abbottabad', name: 'Abbottabad', lat: 34.1688, lon: 73.2215, type: 'hilly' },
  { id: 'mansehra', name: 'Mansehra', lat: 34.3333, lon: 73.2000, type: 'hilly' },
  { id: 'batagram', name: 'Battagram', lat: 34.6783, lon: 73.0236, type: 'hilly' },
  { id: 'swat', name: 'Swat (Saidu Sharif)', lat: 34.7465, lon: 72.3576, type: 'hilly' },
  { id: 'mingora', name: 'Mingora', lat: 34.7717, lon: 72.3600, type: 'hilly' },
  { id: 'dir-lower', name: 'Lower Dir (Timergara)', lat: 34.8281, lon: 71.8403, type: 'hilly' },
  { id: 'dir-upper', name: 'Upper Dir', lat: 35.2074, lon: 71.8768, type: 'hilly' },
  { id: 'buner', name: 'Buner', lat: 34.3891, lon: 72.6151, type: 'hilly' },
  { id: 'kohistan', name: 'Dasu (Kohistan)', lat: 35.2917, lon: 73.2903, type: 'hilly' },
  { id: 'shangla', name: 'Shangla', lat: 34.9210, lon: 72.6371, type: 'hilly' },
  { id: 'haripur', name: 'Haripur', lat: 33.9946, lon: 72.9334, type: 'plain' },
  { id: 'chakdara', name: 'Chakdara', lat: 34.6500, lon: 71.7833, type: 'hilly' },

  // --- Balochistan ---
  { id: 'quetta', name: 'Quetta', lat: 30.1798, lon: 66.9750, type: 'plain' },
  { id: 'khuzdar', name: 'Khuzdar', lat: 27.8000, lon: 66.6167, type: 'plain' },
  { id: 'gwadar', name: 'Gwadar', lat: 25.1264, lon: 62.3225, type: 'plain' },
  { id: 'turbat', name: 'Turbat', lat: 26.0012, lon: 63.0500, type: 'plain' },
  { id: 'chaman', name: 'Chaman', lat: 30.9236, lon: 66.4514, type: 'plain' },
  { id: 'zhob', name: 'Zhob', lat: 31.3417, lon: 69.4486, type: 'plain' },
  { id: 'loralai', name: 'Loralai', lat: 30.3700, lon: 68.5970, type: 'plain' },
  { id: 'sibi', name: 'Sibi', lat: 29.5452, lon: 67.8773, type: 'plain' },
  { id: 'dera-murad-jamali', name: 'Dera Murad Jamali', lat: 28.5466, lon: 68.2231, type: 'plain' },
  { id: 'kalat', name: 'Kalat', lat: 29.0260, lon: 66.5900, type: 'plain' },
  { id: 'mastung', name: 'Mastung', lat: 29.7997, lon: 66.8455, type: 'plain' },
  { id: 'hub', name: 'Hub', lat: 25.0300, lon: 66.8800, type: 'plain' },
  { id: 'panjgur', name: 'Panjgur', lat: 26.9667, lon: 64.1000, type: 'plain' },
  { id: 'ormara', name: 'Ormara', lat: 25.2080, lon: 64.6380, type: 'plain' },

  // --- Gilgit-Baltistan ---
  { id: 'gilgit', name: 'Gilgit', lat: 35.9206, lon: 74.3083, type: 'hilly' },
  { id: 'skardu', name: 'Skardu', lat: 35.2976, lon: 75.6333, type: 'hilly' },
  { id: 'hunza', name: 'Hunza', lat: 36.3167, lon: 74.6500, type: 'hilly' },
  { id: 'ghizer', name: 'Ghizer', lat: 36.0639, lon: 73.9117, type: 'hilly' },
  { id: 'nagar', name: 'Nagar', lat: 36.2556, lon: 74.8178, type: 'hilly' },
  { id: 'ghanche', name: 'Ghanche (Khaplu)', lat: 35.1434, lon: 76.3375, type: 'hilly' },
  { id: 'astore', name: 'Astore', lat: 35.3494, lon: 74.9044, type: 'hilly' },
  { id: 'chilas', name: 'Chilas (Diamer)', lat: 35.4200, lon: 74.0950, type: 'hilly' },

  // --- Azad Jammu & Kashmir ---
  { id: 'muzaffarabad', name: 'Muzaffarabad', lat: 34.3700, lon: 73.4711, type: 'hilly' },
  { id: 'mirpur-ajk', name: 'Mirpur (AJK)', lat: 33.1333, lon: 73.7500, type: 'plain' },
  { id: 'bhimber', name: 'Bhimber', lat: 32.9746, lon: 74.0785, type: 'plain' },
  { id: 'kotli', name: 'Kotli', lat: 33.5156, lon: 73.9017, type: 'hilly' },
  { id: 'rawalakot', name: 'Rawalakot', lat: 33.8578, lon: 73.7604, type: 'hilly' },
  { id: 'bagh-ajk', name: 'Bagh', lat: 33.9803, lon: 73.7747, type: 'hilly' },
  { id: 'hattian-bala', name: 'Hattian Bala', lat: 34.1691, lon: 73.7434, type: 'hilly' },
];

// ---------------- SYNTHETIC POINT GENERATION ----------------

// Clamp helper to keep points roughly inside Pakistan bounding box
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// Generate N synthetic points around each base city with small lat/lon offsets
function generateSyntheticPoints(baseCities, pointsPerCity = 3) {
  const synthetic = [];
  const offsets = [
    { dLat: 0.18, dLon: 0.14 },
    { dLat: -0.15, dLon: 0.12 },
    { dLat: 0.12, dLon: -0.18 },
    { dLat: -0.18, dLon: -0.14 },
  ];

  baseCities.forEach((city) => {
    for (let i = 0; i < pointsPerCity; i++) {
      const o = offsets[i % offsets.length];
      const lat = clamp(city.lat + o.dLat, 23.0, 37.5);
      const lon = clamp(city.lon + o.dLon, 60.5, 78.5);

      synthetic.push({
        id: `${city.id}-s${i + 1}`,
        name: `${city.name} (area ${i + 1})`,
        lat,
        lon,
        type: city.type, // inherit plain/hilly
        synthetic: true,
        baseCityId: city.id,
      });
    }
  });

  return synthetic;
}

const SYNTHETIC_POINTS = generateSyntheticPoints(BASE_CITIES, 3);

// Combined list – this will easily exceed 300 points
const CITIES = [...BASE_CITIES, ...SYNTHETIC_POINTS];

module.exports = {
  CITIES,
  BASE_CITIES,
  SYNTHETIC_POINTS,
};
