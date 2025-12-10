// src/index.js

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { CITIES } = require('./config/cities');
const { computeHeatIndexC, classifyHeatRisk } = require('./utils/heatIndex');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// In-memory event store (latest first)
let recentEvents = [];
const MAX_EVENTS = 500;

// SSE clients
const clients = [];

// ---- SSE endpoint ----
app.get('/events/stream', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });
  res.flushHeaders();

  const clientId = Date.now();
  const client = { id: clientId, res };

  clients.push(client);
  console.log(`Client connected: ${clientId}, total=${clients.length}`);

  // optional: send a hello ping
  res.write(`data: ${JSON.stringify({ type: 'welcome', ts: new Date().toISOString() })}\n\n`);

  req.on('close', () => {
    const idx = clients.findIndex(c => c.id === clientId);
    if (idx !== -1) clients.splice(idx, 1);
    console.log(`Client closed: ${clientId}, total=${clients.length}`);
  });
});

function sendEventToClients(event) {
  const payload = `data: ${JSON.stringify(event)}\n\n`;
  clients.forEach(c => {
    try {
      c.res.write(payload);
    } catch (e) {
      console.error('Error writing SSE to client', e);
    }
  });
}

// ---- Helper: fetch weather for one city ----
// Using Open-Meteo free API
async function fetchCityWeather(city) {
  const url = `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${city.lat}` +
    `&longitude=${city.lon}` +
    `&hourly=temperature_2m,relativehumidity_2m` +
    `&current_weather=true` +
    `&timezone=auto`;

  const { data } = await axios.get(url);

  const tempC = data.current_weather?.temperature ?? null;
  const isDay = data.current_weather?.is_day ?? null;

  const rhArr = data.hourly?.relativehumidity_2m || [];
  const timeArr = data.hourly?.time || [];
  const lastIdx = rhArr.length - 1;
  const rh = lastIdx >= 0 ? rhArr[lastIdx] : null;
  const rhTime = lastIdx >= 0 ? timeArr[lastIdx] : null;

  if (tempC == null || rh == null) {
    return null;
  }

  const heatIndexC = computeHeatIndexC(tempC, rh);
  const riskLevel = classifyHeatRisk(heatIndexC);

  // PMD-like heatwave condition (simplified):
  // Plains: temp >= 40°C, Hilly: temp >= 30°C
  const pmdHeatwave =
    (city.type === 'plain' && tempC >= 40) ||
    (city.type === 'hilly' && tempC >= 30);

  const nowIso = new Date().toISOString();

  const event = {
    type: 'heat_update',
    cityId: city.id,
    city: city.name,
    lat: city.lat,
    lon: city.lon,
    tempC,
    rh,
    heatIndexC,
    riskLevel,     // none, caution, extreme_caution, danger, extreme_danger
    pmdHeatwave,
    isDay,
    rhTime,
    ts: nowIso
  };

  return event;
}

// ---- Poll all cities ----
async function pollAllCities() {
  console.log(`[poll] Polling all cities at ${new Date().toISOString()}`);
  for (const city of CITIES) {
    try {
      const ev = await fetchCityWeather(city);
      if (!ev) continue;

      // Save to in-memory buffer
      recentEvents.unshift(ev);
      if (recentEvents.length > MAX_EVENTS) {
        recentEvents = recentEvents.slice(0, MAX_EVENTS);
      }

      // Decide when to push to clients:
      // push if riskLevel >= extreme_caution OR pmdHeatwave
      const push =
        ev.pmdHeatwave ||
        ev.riskLevel === 'extreme_caution' ||
        ev.riskLevel === 'danger' ||
        ev.riskLevel === 'extreme_danger';

      if (push) {
        console.log(`[alert] ${ev.city} temp=${ev.tempC}°C hi=${ev.heatIndexC}°C risk=${ev.riskLevel} pmd=${ev.pmdHeatwave}`);
        sendEventToClients(ev);
      }
    } catch (err) {
      console.error(`Error polling city ${city.name}`, err.message);
    }
  }
}

// Initial poll + interval
(async () => {
  try {
    await pollAllCities();
  } catch (e) {
    console.error('Initial poll failed', e.message);
  }
})();

// Poll every 10 minutes (adjust as you like)
const POLL_INTERVAL_MS = 10 *60 * 1000;
setInterval(pollAllCities, POLL_INTERVAL_MS);

// ---- REST endpoints ----

app.get('/api/cities', (req, res) => {
  res.json(CITIES);
});

app.get('/api/events/recent', (req, res) => {
  const limit = Number(req.query.limit) || 100;
  res.json(recentEvents.slice(0, limit));
});

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    uptime: process.uptime(),
    clients: clients.length,
    eventsCount: recentEvents.length,
    pollIntervalMinutes: POLL_INTERVAL_MS / 60000
  });
});

app.listen(PORT, () => {
  console.log(`✅ Heatwave backend listening on http://localhost:${PORT}`);
});
