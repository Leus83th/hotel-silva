const db = require('../config/db');

// CREATE RESERVA
exports.createReservation = (req, res) => {
    const { cliente_id, habitacion_id, fecha_inicio, fecha_fin, estado_id } = req.body;
    const sql = "INSERT INTO Reservas (cliente_id, habitacion_id, fecha_inicio, fecha_fin, estado_id) VALUES (?, ?, ?, ?, ?)";
    
    db.query(sql, [cliente_id, habitacion_id, fecha_inicio, fecha_fin, estado_id], (err, result) => {
        if (err) return res.status(500).json({ creado: false, error: "Error al procesar la reserva" });
        res.json({ creado: true, mensaje: "¡Reserva registrada con éxito!" });
    });
};

// READ RESERVAS
exports.getAllReservations = (req, res) => {
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
};

// CREATE HABITACIÓN
exports.createRoom = (req, res) => {
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
};

// READ HABITACIONES
exports.getAllRooms = (req, res) => {
    const sql = `
        SELECT H.id, H.numero, T.nombre AS tipo_habitacion, H.precio_noche 
        FROM Habitaciones H
        INNER JOIN TiposHabitacion T ON H.tipo_id = T.id
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: "Error al obtener habitaciones" });
        res.json(result);
    });
};