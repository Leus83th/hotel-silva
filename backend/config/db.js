const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hotel_silva' // Cambia esto si tu BD se llama diferente
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la BD:', err);
        return;
    }
    console.log('¡Conectado exitosamente a la base de datos de XAMPP!');
});

module.exports = db;