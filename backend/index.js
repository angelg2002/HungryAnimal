// index.js (Actualizado)
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Simulamos nuestra base de datos por un momento
const productos = [
    { id: 1, nombre: 'Comida para Perro', precio: 45000, img: './galery/comida.png' },
    { id: 2, nombre: 'Snacks para Gato', precio: 12000, img: './galery/snacks.png' }
];

// RUTA 1: Saludo
app.get('/', (req, res) => {
    res.send('🐾 Backend de HungryAnimal Activo');
});

// RUTA 2: Listado de productos (NUEVA)
app.get('/api/productos', (req, res) => {
    res.json(productos); // Enviamos el array como JSON
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
});