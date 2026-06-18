const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// 🚨 ESTOS DOS MIDDLEWARES SON OBLIGATORIOS PARA EL LOGIN
app.use(cors());
app.use(express.json()); 

// Configuración de tu conexión a XAMPP
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'hotel_silva'
});

conexion.connect((err) => {
    if (err) {
        console.error('Error en BD:', err);
        return;
    }
    console.log('¡Conectado exitosamente a la base de datos de XAMPP!');
});

// 🚨 ESTA ES LA RUTA QUE BUSCA TU BOTÓN "INGRESAR"
app.post('/api/login', (req, res) => {
    const { usuario, contrasena } = req.body;
    const query = 'SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?';

    conexion.query(query, [usuario, contrasena], (err, results) => {
        if (err) {
            return res.status(500).json({ loginExitoso: false, mensaje: 'Error interno.' });
        }
        if (results.length > 0) {
            res.json({ loginExitoso: true, mensaje: '¡Acceso concedido al Hotel Silva!' });
        } else {
            res.json({ loginExitoso: false, mensaje: 'Usuario o contraseña incorrectos.' });
        }
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});