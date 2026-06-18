const db = require('../config/db');

// 1. CREATE RESERVA
exports.createReservation = (req, res) => {
    const { clienteId, habitacionId, fechaInicio, fechaFin } = req.body;
    const estado_id = 1; // ID por defecto para "Confirmada" en tu BD
    
    const sql = "INSERT INTO Reservas (cliente_id, habitacion_id, fecha_inicio, fecha_fin, estado_id) VALUES (?, ?, ?, ?, ?)";
    
    db.query(sql, [clienteId, habitacionId, fechaInicio, fechaFin, estado_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ registrado: false, error: "Error al procesar la reserva" });
        }
        res.json({ registrado: true, mensaje: "¡Reserva registrada con éxito!" });
    });
};

// 2. READ RESERVAS
exports.getAllReservations = (req, res) => {
    const sql = `
        SELECT R.id, 
               CONCAT(C.nombre, ' ', C.apellido) AS clienteNombre, 
               H.numero AS habitacionNumero, 
               DATE_FORMAT(R.fecha_inicio, '%Y-%m-%d') AS fechaInicio, 
               DATE_FORMAT(R.fecha_fin, '%Y-%m-%d') AS fechaFin, 
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

// 3. UPDATE RESERVA (Añadido para solucionar el error del Router)
exports.updateReservation = (req, res) => {
    const { id } = req.params;
    const { estado_id } = req.body;
    const sql = "UPDATE Reservas SET estado_id = ? WHERE id = ?";
    
    db.query(sql, [estado_id, id], (err, result) => {
        if (err) return res.status(500).json({ actualizado: false, error: "Error al actualizar" });
        res.json({ actualizado: true, mensaje: "Reserva actualizada correctamente" });
    });
};

// 4. DELETE RESERVA (Añadido para solucionar el error del Router)
exports.deleteReservation = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM Reservas WHERE id = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ eliminado: false, error: "Error al eliminar" });
        res.json({ eliminado: true, mensaje: "Reserva eliminada con éxito" });
    });
};

// 5. CREATE HABITACIÓN
exports.createRoom = (req, res) => {
    const { numero, tipo_id, precio_noche } = req.body;
    const sql = "INSERT INTO Habitaciones (numero, tipo_id, precio_noche) VALUES (?, ?, ?)";
    
    db.query(sql, [numero, tipo_id, precio_noche], (err, result) => {
        if (err) return res.status(500).json({ creado: false, error: "Error al registrar la habitación." });
        res.json({ creado: true, mensaje: "¡Habitación agregada con éxito!" });
    });
};

// 6. READ HABITACIONES
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
// UPDATE HABITACIÓN
exports.updateRoom = (req, res) => {
    const { id } = req.params;
    const { numero, precio_noche } = req.body;
    const sql = "UPDATE Habitaciones SET numero = ?, precio_noche = ? WHERE id = ?";
    
    db.query(sql, [numero, precio_noche, id], (err, result) => {
        if (err) return res.status(500).json({ actualizado: false, error: "Error al actualizar la habitación" });
        res.json({ actualizado: true, mensaje: "Habitación modificada con éxito." });
    });
};

// DELETE HABITACIÓN
exports.deleteRoom = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM Habitaciones WHERE id = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            if (err.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(400).json({ eliminado: false, error: "No se puede eliminar la habitación porque tiene reservas activas vinculadas." });
            }
            return res.status(500).json({ eliminado: false, error: "Error al eliminar la habitación" });
        }
        res.json({ eliminado: true, mensaje: "Habitación removida del inventario correctamente." });
    });
};