export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
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
    const url = `https://xeno-canto.org/api/3/recordings?query=${encodeURIComponent(xcQuery)}&key=0379c214849f9af5ad391e5c049caf7179c6d81f`;
    console.log('Fetching:', url);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (BirdApp/1.0)',
        'Accept': 'application/json'
      },
      redirect: 'follow'
    });
    if (!response.ok) {
      console.error('xeno-canto API error:', response.status, await response.text());
      throw new Error(`xeno-canto API error: ${response.status}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('bird-sound error:', err);
    res.status(500).json({ error: 'Error fetching from xeno-canto', details: err.message });
  }
}