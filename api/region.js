import express from 'express';
import countryRegionData from 'country-region-data'; // Importa directamente

const app = express();
app.use(express.json());

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

// Endpoint para autocompletar regiones
app.get('/localidad/find', (req, res) => {
  const query = (req.query.q || '').toLowerCase();
  if (!query || query.length < 2) return res.json([]);
  const coincidencias = regiones.filter(r =>
    r.nombre.toLowerCase().includes(query)
  );
  res.json(coincidencias.slice(0, 20)); // máximo 20 resultados
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});