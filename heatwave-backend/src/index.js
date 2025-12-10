// src/index.js

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { CITIES, BASE_CITIES, SYNTHETIC_POINTS } = require('./config/cities');
const { computeHeatIndexC, classifyHeatRisk } = require('./utils/heatIndex');

const app = express();
const PORT = process.env.PORT || 4000;


app.use(cors({
    origin: 'http://localhost:5173', // your React dev server
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // if you need cookies
}));
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
        Connection: 'keep-alive',
    });
    res.flushHeaders();

    const clientId = Date.now();
    const client = { id: clientId, res };

    clients.push(client);
    console.log(`Client connected: ${clientId}, total=${clients.length}`);

    res.write(`data: ${JSON.stringify({ type: 'welcome', ts: new Date().toISOString() })}\n\n`);

    req.on('close', () => {
        const idx = clients.findIndex((c) => c.id === clientId);
        if (idx !== -1) clients.splice(idx, 1);
        console.log(`Client closed: ${clientId}, total=${clients.length}`);
    });
});

function sendEventToClients(event) {
    const payload = `data: ${JSON.stringify(event)}\n\n`;
    clients.forEach((c) => {
        try {
            c.res.write(payload);
        } catch (e) {
            console.error('Error writing SSE to client', e);
        }
    });
}

// ---------- BATCH HELPERS ----------

function chunkArray(arr, size) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}

/**
 * Fetch weather for a batch of *base* cities using Open-Meteo multi-coordinate feature.
 */
async function fetchBatchWeatherForBaseCities(baseCitiesChunk) {
    if (!baseCitiesChunk || baseCitiesChunk.length === 0) return [];

    const latitudes = baseCitiesChunk.map((c) => c.lat).join(',');
    const longitudes = baseCitiesChunk.map((c) => c.lon).join(',');

    const url =
        'https://api.open-meteo.com/v1/forecast' +
        `?latitude=${latitudes}` +
        `&longitude=${longitudes}` +
        `&hourly=temperature_2m,relativehumidity_2m` +
        `&current_weather=true` +
        `&timezone=GMT`;

    const { data } = await axios.get(url).catch((err) => {
        if (err.response) {
            console.error('Open-Meteo error:', err.response.status, err.response.statusText);
        } else {
            console.error('Open-Meteo error:', err.message);
        }
        throw err;
    });

    const responses = Array.isArray(data) ? data : [data];
    const baseEvents = [];

    responses.forEach((resp, index) => {
        const city = baseCitiesChunk[index];
        if (!city || !resp) return;

        const tempC = resp.current_weather?.temperature ?? null;
        const isDay = resp.current_weather?.is_day ?? null;

        const rhArr = resp.hourly?.relativehumidity_2m || [];
        const timeArr = resp.hourly?.time || [];
        const lastIdx = rhArr.length - 1;
        const rh = lastIdx >= 0 ? rhArr[lastIdx] : null;
        const rhTime = lastIdx >= 0 ? timeArr[lastIdx] : null;

        if (tempC == null || rh == null) return;

        const heatIndexC = computeHeatIndexC(tempC, rh);
        const riskLevel = classifyHeatRisk(heatIndexC);

        const pmdHeatwave =
            (city.type === 'plain' && tempC >= 40) ||
            (city.type === 'hilly' && tempC >= 30);

        const nowIso = new Date().toISOString();

        // ---- NEW improved weight ----
        const heatWeight = computeHeatWeight(heatIndexC, riskLevel);

        const event = {
            type: 'heat_update',
            cityId: city.id,
            city: city.name,
            lat: roundCoord(city.lat),
            lon: roundCoord(city.lon),
            tempC,
            rh,
            heatIndexC,
            heatWeight,
            riskLevel,
            pmdHeatwave,
            isDay,
            rhTime,
            synthetic: false,
            ts: nowIso
        };

        baseEvents.push(event);
    });

    return baseEvents;
}

/**
 * Expand base events to synthetic ones
 */
function expandEventsToSynthetic(baseEvents) {
    const allEvents = [];

    baseEvents.forEach((baseEv) => {
        allEvents.push(baseEv);

        const relatedSynthetic = SYNTHETIC_POINTS.filter(
            (p) => p.baseCityId === baseEv.cityId
        );

        relatedSynthetic.forEach((pt) => {
            allEvents.push({
                ...baseEv,
                cityId: pt.id,
                city: pt.name,
                lat: roundCoord(pt.lat),
                lon: roundCoord(pt.lon),
                synthetic: true,
                heatWeight: baseEv.heatWeight
            });
        });
    });

    return allEvents;
}

// ---- Poll all cities ----
async function pollAllCitiesBatched() {
    console.log(`[poll] Polling base cities (batched) at ${new Date().toISOString()}`);

    const BATCH_SIZE = 90;
    const chunks = chunkArray(BASE_CITIES, BATCH_SIZE);

    for (const chunk of chunks) {
        try {
            const baseEvents = await fetchBatchWeatherForBaseCities(chunk);
            const events = expandEventsToSynthetic(baseEvents);

            for (const ev of events) {
                recentEvents.unshift(ev);
                if (recentEvents.length > MAX_EVENTS) {
                    recentEvents = recentEvents.slice(0, MAX_EVENTS);
                }

                // alerts: unchanged
                const push =
                    ev.pmdHeatwave ||
                    ev.riskLevel === 'extreme_caution' ||
                    ev.riskLevel === 'danger' ||
                    ev.riskLevel === 'extreme_danger';

                if (push && !ev.synthetic) {
                    console.log(
                        `[alert] ${ev.city} temp=${ev.tempC}°C hi=${ev.heatIndexC}°C risk=${ev.riskLevel} pmd=${ev.pmdHeatwave}`
                    );
                    sendEventToClients(ev);
                }
            }
        } catch (err) {
            console.error('Batch poll error', err.message);
            break;
        }
    }
}

// Initial poll
(async () => {
    try {
        await pollAllCitiesBatched();
    } catch (e) {
        console.error('Initial poll failed', e.message);
    }
})();

// Poll every 10 minutes
const POLL_INTERVAL_MS = 10 * 60 * 1000;
setInterval(pollAllCitiesBatched, POLL_INTERVAL_MS);

// ---- Endpoints ----

app.get('/api/cities', (req, res) => {
    res.json(BASE_CITIES);
});

app.get('/api/cities/all', (req, res) => {
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
        pollIntervalMinutes: POLL_INTERVAL_MS / 60000,
        baseCities: BASE_CITIES.length,
        syntheticPoints: SYNTHETIC_POINTS.length,
    });
});

// --- GET LATEST DATA FOR A SINGLE CITY ---
// /api/city?name=lahore
// /api/city?id=lahore

app.get('/api/city', (req, res) => {
    const name = req.query.name ? req.query.name.toLowerCase() : null;
    const id = req.query.id ? req.query.id.toLowerCase() : null;

    if (!name && !id) {
        return res.status(400).json({
            error: "Please provide either ?name=cityName or ?id=cityId"
        });
    }

    // Look inside recent events (already stores newest → oldest)
    const ev = recentEvents.find(e => {
        if (id && e.cityId.toLowerCase() === id) return true;
        if (name && e.city.toLowerCase() === name) return true;
        return false;
    });

    if (!ev) {
        return res.status(404).json({ error: "City not found or no recent data." });
    }

    res.json(ev);
});


app.listen(PORT, () => {
    console.log(`✅ Heatwave backend listening on http://localhost:${PORT}`);
});

// ---------- NEW improved heat weight function ----------

function computeHeatWeight(hiC, riskLevel) {
    // baseline visibility so winter map is not empty
    let base = 0.1;

    // contribution from heat index
    if (hiC > 45) base = 1;
    else if (hiC >= 27) {
        base += (hiC - 27) / (45 - 27); // 0 -> 1 scale
    }

    // risk-level boost
    const riskBoost = {
        none: 0.0,
        caution: 0.15,
        extreme_caution: 0.3,
        danger: 0.5,
        extreme_danger: 0.7
    };

    const weight = base * 0.7 + riskBoost[riskLevel] * 0.3;

    return Math.min(1, parseFloat(weight.toFixed(3)));
}

function roundCoord(value) {
    if (typeof value !== 'number') return value;
    return Number(value.toFixed(4)); // 4 decimal places
}

