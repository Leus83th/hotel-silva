const db = require('../config/db');

// CREATE
exports.createClient = (req, res) => {
    const { nombre, apellido, correo, telefono } = req.body;
    const sql = "INSERT INTO clientes (nombre, apellido, correo, telefono) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [nombre, apellido, correo, telefono], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ registrado: false, error: "El correo electrónico ya está registrado." });
            }
            return res.status(500).json({ registrado: false, error: "Error interno en el servidor." });
        }
        res.json({ registrado: true, mensaje: "¡Cliente registrado con éxito!" });
    });
};

// READ
exports.getAllClients = (req, res) => {
    const sql = "SELECT * FROM clientes";
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error al obtener los clientes" });
        }
        res.json(result);
    });
};

// UPDATE
exports.updateClient = (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, correo, telefono } = req.body;
    const sql = "UPDATE clientes SET nombre = ?, apellido = ?, correo = ?, telefono = ? WHERE id = ?";
    
    db.query(sql, [nombre, apellido, correo, telefono, id], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ actualizado: false, error: "Ese correo ya pertenece a otro cliente." });
            }
            return res.status(500).json({ actualizado: false, error: "Error al actualizar los datos." });
        }
        res.json({ actualizado: true, mensaje: "¡Los datos del cliente se actualizaron con éxito!" });
    });
};

// DELETE
exports.deleteClient = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM Clientes WHERE id = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ eliminado: false, error: "No se pudo eliminar al cliente." });
        }
        res.json({ eliminado: true, mensaje: "El cliente ha sido eliminado correctamente." });
    });
};