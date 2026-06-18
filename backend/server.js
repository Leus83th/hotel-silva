const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Importar los enrutadores
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

// Redireccionar las llamadas de la API a sus respectivas rutas
app.use('/api', authRoutes);         
app.use('/api', clientRoutes);       
app.use('/api', reservationRoutes);  

// Puerto de escucha
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});