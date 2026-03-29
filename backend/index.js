const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// RUTA 1: Saludo
app.get('/', (req, res) => {
    res.send('🐾 Backend de HungryAnimal Activo');
});

// RUTA 2: Listado de productos (NUEVA: Leído desde el archivo JSON real)
app.get('/api/productos', (req, res) => {
    const jsonPath = path.join(__dirname, '../frontend/productos.json');
    fs.readFile(jsonPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error al leer productos.json:", err);
            return res.status(500).json({ error: 'Error al leer la base de datos' });
        }
        res.json(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
});