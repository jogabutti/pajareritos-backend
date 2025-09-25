export default function handler(req, res) {
  const { q } = req.query;
  if (!q || q.length < 2) return res.json([]);
  const sonidos = [
    { nombre: "Zorzal", url: "https://ejemplo.com/zorzal.mp3" },
    { nombre: "Calandria", url: "https://ejemplo.com/calandria.mp3" },
    { nombre: "Jilguero", url: "https://ejemplo.com/jilguero.mp3" }
  ];
  const resultado = sonidos.filter(s => s.nombre.toLowerCase().includes(q.toLowerCase()));
  res.json(resultado);
}