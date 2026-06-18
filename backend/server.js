const express = require('express');
const cors = require('cors');
const path = require('path'); // Movido arriba con las demás importaciones

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Ruta para cargar el login directamente en la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'login.html'));
});

// Importar los enrutadores
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

// Redirección de la API
app.use('/api/auth', authRoutes);         
app.use('/api/clientes', clientRoutes);     
app.use('/api/reservas', reservationRoutes); 

// Puerto de escucha
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});