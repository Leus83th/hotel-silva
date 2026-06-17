const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// ENDPOINT DE LOGIN
app.post('/api/login', (req, res) => {
    const { usuario, contrasena } = req.body;

    const sql = "SELECT * FROM Administradores WHERE usuario = ? AND contrasena = ?";
    db.query(sql, [usuario, contrasena], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error en el servidor" });
        }
        
        if (result.length > 0) {
            // Si coincide, respondemos que fue exitoso
            res.json({ loginExitoso: true, mensaje: "¡Bienvenido al sistema!" });
        } else {
            // Si no coincide
            res.json({ loginExitoso: false, mensaje: "Usuario o contraseña incorrectos" });
        }
    });
});

const PORT = 3001;
// 1. RUTA PARA REGISTRAR UN NUEVO CLIENTE (CREATE)
app.post('/api/clientes', (req, res) => {
    const { nombre, apellido, correo, telefono } = req.body;

    const sql = "INSERT INTO Clientes (nombre, apellido, correo, telefono) VALUES (?, ?, ?, ?)";
    db.query(sql, [nombre, apellido, correo, telefono], (err, result) => {
        if (err) {
            // Si el correo ya existe (por el UNIQUE en la BD)
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ registrado: false, error: "El correo electrónico ya está registrado." });
            }
            return res.status(500).json({ registrado: false, error: "Error interno en el servidor." });
        }
        res.json({ registrado: true, mensaje: "¡Cliente registrado con éxito!" });
    });
});

// 2. RUTA PARA OBTENER TODOS LOS CLIENTES (READ)
app.get('/api/clientes', (req, res) => {
    const sql = "SELECT * FROM Clientes";
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error al obtener los clientes" });
        }
        res.json(result); // Devuelve la lista de clientes en formato JSON
    });
});
// ==========================================
// 1. RUTA PARA ELIMINAR CLIENTE (DELETE)
// ==========================================
app.delete('/api/clientes/:id', (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM Clientes WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ eliminado: false, error: "No se pudo eliminar al cliente." });
        }
        res.json({ eliminado: true, mensaje: "El cliente ha sido eliminado correctamente." });
    });
});

// ==========================================
// 2. RUTA PARA ACTUALIZAR CLIENTE (UPDATE)
// ==========================================
app.put('/api/clientes/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, correo, telefono } = req.body;

    const sql = "UPDATE Clientes SET nombre = ?, apellido = ?, correo = ?, telefono = ? WHERE id = ?";
    db.query(sql, [nombre, apellido, correo, telefono, id], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ actualizado: false, error: "Ese correo ya pertenece a otro cliente." });
            }
            return res.status(500).json({ actualizado: false, error: "Error al actualizar los datos." });
        }
        res.json({ actualizado: true, mensaje: "¡Los datos del cliente se actualizaron con éxito!" });
    });
});
// READ: Obtener habitaciones con su tipo de habitación (Crucial para la universidad)
app.get('/api/habitaciones', (req, res) => {
    const sql = `
        SELECT H.id, H.numero, T.nombre AS tipo_habitacion, H.precio_noche 
        FROM Habitaciones H
        INNER JOIN TiposHabitacion T ON H.tipo_id = T.id
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: "Error al obtener habitaciones" });
        res.json(result);
    });
});
// CREATE: Crear una nueva reserva
app.post('/api/reservas', (req, res) => {
    const { cliente_id, habitacion_id, fecha_inicio, fecha_fin, estado_id } = req.body;
    const sql = "INSERT INTO Reservas (cliente_id, habitacion_id, fecha_inicio, fecha_fin, estado_id) VALUES (?, ?, ?, ?, ?)";
    
    db.query(sql, [cliente_id, habitacion_id, fecha_inicio, fecha_fin, estado_id], (err, result) => {
        if (err) return res.status(500).json({ creado: false, error: "Error al procesar la reserva" });
        res.json({ creado: true, mensaje: "¡Reserva registrada con éxito!" });
    });
});

// READ: Obtener el listado de reservas con datos cruzados (Nombres y Números)
app.get('/api/reservas', (req, res) => {
    const sql = `
        SELECT R.id, 
               CONCAT(C.nombre, ' ', C.apellido) AS nombre_cliente, 
               H.numero AS numero_habitacion, 
               DATE_FORMAT(R.fecha_inicio, '%Y-%m-%d') AS fecha_inicio, 
               DATE_FORMAT(R.fecha_fin, '%Y-%m-%d') AS fecha_fin, 
               E.nombre AS estado
        FROM Reservas R
        INNER JOIN Clientes C ON R.cliente_id = C.id
        INNER JOIN Habitaciones H ON R.habitacion_id = H.id
        INNER JOIN EstadosReserva E ON R.estado_id = E.id
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: "Error al obtener las reservas" });
        res.json(result);
    });
});
// CREATE: Registrar una nueva habitación
app.post('/api/habitaciones', (req, res) => {
    const { numero, tipo_id, precio_noche } = req.body;
    const sql = "INSERT INTO Habitaciones (numero, tipo_id, precio_noche) VALUES (?, ?, ?)";
    
    db.query(sql, [numero, tipo_id, precio_noche], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ creado: false, error: "El número de habitación ya existe." });
            }
            return res.status(500).json({ creado: false, error: "Error al registrar la habitación." });
        }
        res.json({ creado: true, mensaje: "¡Habitación agregada con éxito!" });
    });
});
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));