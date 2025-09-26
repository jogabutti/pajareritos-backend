export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  const { q } = req.query;
  if (!q || q.trim() === '') {
    res.json([]);
    return;
  }
  try {
    const fetch = (await import('node-fetch')).default;
    const url = `https://api.ebird.org/v2/ref/region?key=0379c214849f9af5ad391e5c049caf7179c6d81f&q=${encodeURIComponent(q)}`;
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
      res.json([]);
      return;
    }
    let results = Array.isArray(data) ? data : (data.results || []);
    const mapped = results.map(item => ({
      name: item.name || item.displayName || '',
      code: item.code || item.regionCode || ''
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ error: 'Error consultando eBird Autocomplete' });
  }
}