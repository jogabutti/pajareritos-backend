const apiKey = '0379c214849f9af5ad391e5c049caf7179c6d81f';
const express = require('express');
const cors = require('cors');
const app = express();

// Configura CORS antes de las rutas
app.use(cors({
  origin: 'https://jogabutti.github.io/pajareritos/', 
  methods: ['GET', 'POST'],
  credentials: true
}));

export default async function handler(req, res) {
  if (req.method === 'GET' && req.query.test === 'ping') {
    res.status(200).json({ message: 'pong' });
    return;
  }

  // Configuración manual de CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://jogabutti.github.io'); // Cambia por el dominio de tu frontend
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejo de preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
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
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
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
}