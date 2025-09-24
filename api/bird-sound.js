import express from 'express';
import regionRouter from './region.js';
import cors from 'cors';

const apiKey = '0379c214849f9af5ad391e5c049caf7179c6d81f';

console.log('Backend Express iniciado');
const app = express();
app.use('/api', regionRouter);
app.use(cors({
  origin: 'https://jogabutti.github.io/pajareritos/',
  methods: ['GET', 'POST'],
  credentials: true
}));

// Endpoint principal para sonidos de aves
app.get('/api/bird-sound', async (req, res) => {
  if (req.query.test === 'ping') {
    res.status(200).json({ message: 'pong' });
    return;
  }
  const { query } = req.query;
  if (!query) {
    res.status(400).json({ error: 'Missing query parameter' });
    return;
  }
  try {
    const xcQuery = `sp:"${query}" grp:birds`;
    const url = `https://xeno-canto.org/api/3/recordings?query=${encodeURIComponent(xcQuery)}&key=${apiKey}`;
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (BirdApp/1.0)',
        'Accept': 'application/json'
      },
      redirect: 'follow'
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching from xeno-canto' });
  }
});

// Endpoint para autocompletar lugares y obtener el código del lugar
app.get('/api/location/autocomplete', async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim() === '') {
    res.json([]);
    return;
  }
  try {
    const fetch = (await import('node-fetch')).default;
    // eBird usa el endpoint de 'region' para autocompletar lugares
    const url = `https://api.ebird.org/v2/ref/region?key=${apiKey}&q=${encodeURIComponent(q)}`;
    console.log('Request a eBird Autocomplete:', url);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (BirdApp/1.0)',
        'Accept': 'application/json'
      }
    });
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Respuesta no válida de eBird Autocomplete:', text);
      res.json([]);
      return;
    }
    // El array de resultados puede estar en data.results o directamente en data
    let results = Array.isArray(data) ? data : (data.results || []);
    // Devuelve solo nombre y código del lugar
    const mapped = results.map(item => ({
      name: item.name || item.displayName || '',
      code: item.code || item.regionCode || ''
    }));
    res.json(mapped);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error consultando eBird Autocomplete' });
  }
});

// Ping de prueba
app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;

