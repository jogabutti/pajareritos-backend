export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-eBirdApiToken");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  const query = req.query.q?.toLowerCase();
  if (!query || query.length < 3) return res.json([]);

  try {
    const response = await fetch(
      "https://api.ebird.org/v2/ref/hotspot/AR-X?fmt=json",
      {
        headers: {
          "X-eBirdApiToken": process.env.EBIRD_API_KEY
        }
      }
    );

    if (!response.ok) {
      return res.status(500).json([]);
    }

    const hotspots = await response.json();

    const filtrados = hotspots.filter(h =>
      h.locName.toLowerCase().includes(query)
    );

    return res.json(
      filtrados.slice(0, 30).map(h => ({
        codigo: h.locId,
        nombre: h.locName,
        lat: h.lat,
        lon: h.lng
      }))
    );

  } catch (error) {
    console.error(error);
    return res.json([]);
  }
}
