import countryRegionData from 'country-region-data';

// Convierte la estructura a un array plano de regiones
const regiones = [];
countryRegionData.forEach(country => {
  country.regions.forEach(region => {
    regiones.push({
      nombre: `${region.name}, ${country.countryName}`,
      codigo: `${country.countryShortCode}-${region.shortCode || region.name}`,
      pais: country.countryName
    });
  });
});

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  const query = (req.query.q || '').toLowerCase();
  if (!query || query.length < 2) return res.json([]);
  const coincidencias = regiones.filter(r =>
    r.nombre.toLowerCase().includes(query)
  );
  res.json(coincidencias.slice(0, 20)); // máximo 20 resultados
}